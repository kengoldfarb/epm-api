// eslint-disable-next-line import/no-extraneous-dependencies
// import AWS from 'aws-sdk'
import { Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User'
import { API } from '../types/api.generated'
import { IRequest, IResponse } from '../types/app'

export default class MeemIdController {
	public static async login(
		req: IRequest<API.v1.Login.IDefinition>,
		res: IResponse<API.v1.Login.IResponseBody>
	): Promise<Response> {
		const { message, signature, shouldConnectUser } = req.body

		let user: User | null = null

		if (shouldConnectUser) {
			if (!req.wallet) {
				throw new Error('USER_NOT_LOGGED_IN')
			}
			user = await services.meemId.getUserForWallet(req.wallet)
		}

		const { jwt } = await services.meemId.login({
			attachToUser: user,
			message,
			signature
		})

		return res.json({
			jwt
		})
	}

	public static async createOrUpdateUser(
		req: IRequest<API.v1.CreateOrUpdateUser.IDefinition>,
		res: IResponse<API.v1.CreateOrUpdateUser.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		const { profilePicBase64, displayName } = req.body

		const user = (await services.meemId.createOrUpdateUser({
			wallet: req.wallet,
			profilePicBase64,
			displayName
		})) as API.IUser

		return res.json({
			user
		})
	}

	public static async getMe(
		req: IRequest<API.v1.GetMe.IDefinition>,
		res: IResponse<API.v1.GetMe.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		const user = (await services.meemId.getUserForWallet(
			req.wallet
		)) as API.IUser
		return res.json({
			walletId: req.wallet.id,
			address: req.wallet.address,
			user
		})
	}

	public static async refreshENS(
		req: IRequest<API.v1.RefreshENS.IDefinition>,
		res: IResponse<API.v1.RefreshENS.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await services.meemId.updateENS(req.wallet)

		return res.json({
			status: 'success'
		})
	}

	public static async getApiKey(
		req: IRequest<API.v1.GetApiKey.IDefinition>,
		res: IResponse<API.v1.GetApiKey.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		const newApiKey = uuidv4()
		req.wallet.apiKey = newApiKey
		await req.wallet.save()

		return res.json({
			jwt: services.meemId.generateJWT({
				walletAddress: req.wallet.address,
				data: {
					apiKey: newApiKey
				},
				expiresIn: null
			})
		})
	}
}
