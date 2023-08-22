import crypto from 'crypto'
import jsonwebtoken, { SignOptions } from 'jsonwebtoken'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { v4 as uuidv4 } from 'uuid'
import MeemIdentity from '../models/User'
import type User from '../models/User'
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

		wallet.nonce = `Welcome! Sign this message to verify it's really you. This does not cost any gas fees.\n\nWallet: ${
			options.address
		}\n\nRandom key:\n${crypto.randomBytes(50).toString('hex')}`
		await wallet.save()

		return wallet.nonce
	}

	public static async updateENS(item: Wallet) {
		const ens = await services.ethers.lookupAddress(item.address)
		// eslint-disable-next-line no-param-reassign
		item.ens = ens
		// eslint-disable-next-line no-param-reassign
		item.ensFetchedAt = DateTime.now().toJSDate()
		await item.save()
	}

	public static async login(options: {
		/** Attach the login method to an existing user */
		attachToUser?: User | null

		/** The message that was signed */
		message?: string

		/** Wallet signature */
		signature?: string
	}) {
		const { attachToUser, message, signature } = options

		let wallet: Wallet | undefined | null
		let user: User | undefined | null = attachToUser

		if (attachToUser && attachToUser.DefaultWalletId) {
			wallet = await orm.models.Wallet.findOne({
				where: {
					id: attachToUser.DefaultWalletId
				}
			})
		}

		if (message && signature) {
			wallet = await this.verifySignature({ message, signature })

			if (wallet.UserId) {
				user = await orm.models.User.findOne({
					where: {
						id: wallet.UserId
					}
				})
			} else {
				const t = await orm.sequelize.transaction()
				user = await orm.models.User.create(
					{
						DefaultWalletId: wallet.id
					},
					{
						transaction: t
					}
				)

				wallet.UserId = user.id
				await wallet.save({
					transaction: t
				})

				await t.commit()
			}
		}

		if (!user) {
			throw new Error('LOGIN_FAILED')
		}

		if (!wallet) {
			throw new Error('MISSING_WALLET')
		}

		return {
			user,
			jwt: this.generateJWT({
				walletAddress: wallet?.address ?? '',
				data: {
					'https://hasura.io/jwt/claims': {
						'x-hasura-allowed-roles': ['anonymous', 'user', 'mutualClubMember'],
						'x-hasura-default-role': 'user',
						'x-hasura-wallet-id': wallet?.id ?? '',
						'x-hasura-user-id': user?.id ?? ''
					}
				}
			})
		}
	}

	public static async verifySignature(options: {
		message: string
		signature: string
	}) {
		const ethers = services.ethers.getInstance()
		const { message, signature } = options

		const address = ethers.utils.verifyMessage(message, signature)
		let wallet = await orm.models.Wallet.findByAddress<Wallet>(address)

		if (!wallet) {
			wallet = await orm.models.Wallet.create({
				address
			})
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
			algorithm: 'HS256',
			jwtid: uuidv4()
		}
		if (expiresIn !== null) {
			let exp = config.JWT_EXPIRES_IN
			if (expiresIn && +expiresIn > 0) {
				exp = +expiresIn
			}
			jwtOptions.expiresIn = exp
		}
		log.debug(
			'Sign JWT',
			{
				...data,
				walletAddress
			},
			config.JWT_SECRET,
			jwtOptions
		)
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
		const data = jsonwebtoken.verify(token, config.JWT_SECRET, {
			algorithms: ['HS256']
		})
		return data as Record<string, any>
	}

	public static async getUserForWallet(wallet: Wallet): Promise<User> {
		let user = await orm.models.User.findOne({
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

		if (!user) {
			user = await this.createOrUpdateUser({
				wallet
			})
		}

		return user
	}

	public static async getMeemIdentityForAddress(
		address: string
	): Promise<MeemIdentity> {
		let user = await orm.models.User.findOne({
			include: [
				{
					model: orm.models.Wallet,
					where: {
						address
					},
					attributes: ['id', 'address', 'ens'],
					through: {
						attributes: []
					}
				},
				{
					model: orm.models.Wallet,
					as: 'DefaultWallet',
					attributes: ['id', 'address', 'ens']
				}
			]
		})

		if (!user) {
			const wallet = await orm.models.Wallet.create({
				address
			})
			user = await this.createOrUpdateUser({
				wallet
			})
		}

		return user
	}

	public static async createOrUpdateUser(data: {
		wallet: Wallet
		profilePicBase64?: string
		displayName?: string
	}): Promise<User> {
		// TODO: Add ability to add another wallet
		const { wallet, displayName } = data
		try {
			let user = await orm.models.User.findOne({
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

			const profilePicUrl = ''

			if (user) {
				const updates: any = {
					...(!_.isUndefined(profilePicUrl) && { profilePicUrl }),
					...(!_.isUndefined(displayName) && { displayName })
				}

				if (_.keys(updates).length > 0) await user.update(updates)
			} else {
				user = await orm.models.User.create({
					profilePicUrl: profilePicUrl ?? null,
					displayName: displayName ?? null,
					DefaultWalletId: wallet.id
				})

				wallet.UserId = user.id
				await wallet.save()

				const updatedUser = await orm.models.User.findOne({
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

				user = updatedUser ?? user
			}

			return user
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}
}
