import crypto from 'crypto'
import jsonwebtoken, { SignOptions } from 'jsonwebtoken'
import _ from 'lodash'
import { DateTime } from 'luxon'
import request from 'superagent'
import { TwitterApi, UserV2 } from 'twitter-api-v2'
import { v4 as uuidv4 } from 'uuid'
import Discord from '../models/Discord'
import type MeemContract from '../models/MeemContract'
import MeemIdentity from '../models/MeemIdentity'
import Twitter from '../models/Twitter'
import type Wallet from '../models/Wallet'

export default class MeemIdentityService {
	public static async getNonce(options: { address: string }) {
		// Generate a nonce and save it for the wallet
		const address = options.address.toLowerCase()

		let wallet = await orm.models.Wallet.findByAddress<Wallet>(address)

		if (!wallet) {
			wallet = orm.models.Wallet.build({
				address
			})
		}

		wallet.nonce = `I'm verifying that I am the owner of wallet: ${
			options.address
		}\n\nBy signing this random key:\n${crypto.randomBytes(50).toString('hex')}`
		await wallet.save()

		return wallet.nonce
	}

	public static async updateENS(item: Wallet | MeemContract) {
		const provider = await services.ethers.getProvider({
			chainId: 1
		})
		const ens = await provider.lookupAddress(item.address)
		item.ens = ens
		item.ensFetchedAt = DateTime.now().toJSDate()
		await item.save()
	}

	public static async login(options: { address?: string; signature?: string }) {
		const { address, signature } = options

		let wallet: Wallet | undefined

		if (address && signature) {
			wallet = await this.verifySignature({ address, signature })
		}

		if (!wallet) {
			throw new Error('LOGIN_FAILED')
		}

		if (wallet.ensFetchedAt === null) {
			await this.updateENS(wallet)
		}

		return {
			jwt: this.generateJWT({
				walletAddress: wallet?.address ?? ''
			})
		}
	}

	public static async verifySignature(options: {
		address: string
		signature: string
	}) {
		const ethers = services.ethers.getInstance()
		const { address, signature } = options

		const wallet = await orm.models.Wallet.findByAddress<Wallet>(address)

		if (!wallet || !wallet.nonce) {
			throw new Error('WALLET_NOT_FOUND')
		}

		if (!config.TESTING) {
			const signingAddress = ethers.utils.verifyMessage(wallet.nonce, signature)
			if (signingAddress.toLowerCase() !== address.toLowerCase()) {
				throw new Error('SIGNATURE_FAILED')
			}
		}

		return wallet
	}

	public static generateJWT(options: {
		walletAddress: string
		/** Additional data to encode in the JWT. Do not store sensitive information here. */
		data?: Record<string, any>
		expiresIn?: number | null
	}) {
		const { walletAddress, expiresIn, data } = options
		const jwtOptions: SignOptions = {
			algorithm: 'HS512',
			jwtid: uuidv4()
		}
		if (expiresIn !== null) {
			let exp = config.JWT_EXPIRES_IN
			if (expiresIn && +expiresIn > 0) {
				exp = +expiresIn
			}
			jwtOptions.expiresIn = exp
		}
		const token = jsonwebtoken.sign(
			{
				...data,
				walletAddress
			},
			config.JWT_SECRET,
			jwtOptions
		)

		return token
	}

	public static verifyJWT(token: string): Record<string, any> {
		const data = jsonwebtoken.verify(token, config.JWT_SECRET)
		return data as Record<string, any>
	}

	public static async getMeemIdentityForWallet(
		wallet: Wallet
	): Promise<MeemIdentity> {
		let meemId = await orm.models.MeemIdentity.findOne({
			include: [
				{
					model: orm.models.Wallet,
					where: {
						address: wallet.address
					}
				},
				{
					model: orm.models.Wallet,
					as: 'DefaultWallet'
				}
			]
		})

		if (!meemId) {
			meemId = await this.createOrUpdateMeemIdentity({
				wallet
			})
		}

		return meemId
	}

	public static async createOrUpdateMeemIdentity(data: {
		wallet: Wallet
		profilePicUrl?: string
		displayName?: string
		isDefaultWallet?: boolean
	}): Promise<MeemIdentity> {
		// TODO: Add ability to add another wallet
		const { wallet, profilePicUrl, displayName } = data
		try {
			let meemId = await orm.models.MeemIdentity.findOne({
				include: [
					{
						model: orm.models.Wallet,
						where: {
							address: wallet.address
						}
					},
					{
						model: orm.models.Wallet,
						as: 'DefaultWallet'
					}
				]
			})

			if (meemId) {
				const updates: any = {
					...(!_.isUndefined(profilePicUrl) && { profilePicUrl }),
					...(!_.isUndefined(displayName) && { displayName })
				}

				if (_.keys(updates).length > 0) await meemId.update(updates)
			} else {
				meemId = await orm.models.MeemIdentity.create({
					profilePicUrl: profilePicUrl ?? null,
					displayName: displayName ?? null,
					DefaultWalletId: wallet.id
				})

				await orm.models.MeemIdentityWallet.create({
					WalletId: wallet.id,
					MeemIdentityId: meemId.id
				})

				const updatedMeemId = await orm.models.MeemIdentity.findOne({
					include: [
						{
							model: orm.models.Wallet,
							where: {
								address: wallet.address
							}
						},
						{
							model: orm.models.Wallet,
							as: 'DefaultWallet'
						}
					]
				})

				meemId = updatedMeemId ?? meemId
			}

			return meemId
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}

	public static async verifyTwitter(data: {
		twitterUsername: string
		walletAddress: string
	}): Promise<UserV2> {
		const client = new TwitterApi(config.TWITTER_BEARER_TOKEN)
		const { twitterUsername, walletAddress } = data

		const twitterUserResult = await client.v2.userByUsername(twitterUsername, {
			'user.fields': ['id', 'username', 'name', 'profile_image_url']
		})

		if (!twitterUserResult) {
			log.crit('No Twitter user found for username')
			throw new Error('SERVER_ERROR')
		}

		const usersLatestTweets = await client.v2.userTimeline(
			twitterUserResult.data.id,
			{
				'tweet.fields': ['created_at', 'entities']
			}
		)

		const verifiedTweet = usersLatestTweets.data.data.find(tweet => {
			const isVerifiedTweet = tweet.text.toLowerCase().includes(walletAddress)
			return isVerifiedTweet
		})

		if (!verifiedTweet) {
			log.crit('Unable to find verification tweet')
			throw new Error('SERVER_ERROR')
		}

		let twitter: Twitter | undefined
		const existingTwitter = await orm.models.Twitter.findOne({
			where: {
				twitterId: twitterUserResult.data.id
			}
		})

		if (!existingTwitter) {
			twitter = await orm.models.Twitter.create({
				id: uuidv4(),
				twitterId: twitterUserResult.data.id
			})
		} else {
			twitter = existingTwitter
		}

		if (!twitter) {
			log.crit('Twitter not found or created')
			throw new Error('SERVER_ERROR')
		}

		return twitterUserResult.data
	}

	public static async verifyDiscord(options: {
		discordAuthCode: string
	}): Promise<Discord> {
		const { discordAuthCode } = options
		try {
			const discordAuthResult = await request
				.post('https://discord.com/api/oauth2/token')
				.field('client_id', config.DISCORD_CLIENT_ID)
				.field('client_secret', config.DISCORD_CLIENT_SECRET)
				.field('grant_type', 'authorization_code')
				.field('redirect_uri', config.DISCORD_AUTH_CALLBACK_URL)
				.field('code', discordAuthCode)

			if (!discordAuthResult.body.access_token) {
				throw new Error('NOT_AUTHORIZED')
			}

			const discordUserResult = await request
				.get('https://discord.com/api/oauth2/@me')
				.auth(discordAuthResult.body.access_token, {
					type: 'bearer'
				})

			if (!discordUserResult.body.user?.id) {
				throw new Error('NOT_AUTHORIZED')
			}

			const discordUser = discordUserResult.body.user
			let discord: Discord

			const existingDiscord = await orm.models.Discord.findOne({
				where: {
					discordId: discordUser.id
				}
			})

			if (existingDiscord) {
				existingDiscord.username = discordUser.username
				existingDiscord.avatar = discordUser.avatar
				const updatedDiscord = await existingDiscord.save()
				discord = updatedDiscord
			} else {
				discord = await orm.models.Discord.create({
					discordId: discordUser.id,
					username: discordUser.username,
					avatar: discordUser.avatar
				})
			}

			return discord
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}
}
