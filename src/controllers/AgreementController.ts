import { Response } from 'express'
import { IRequest, IResponse } from '../types/app'
import { MeemAPI } from '../types/meem.generated'
export default class AgreementController {
	public static async isSlugAvailable(
		req: IRequest<MeemAPI.v1.IsSlugAvailable.IDefinition>,
		res: IResponse<MeemAPI.v1.IsSlugAvailable.IResponseBody>
	): Promise<Response> {
		if (!req.body.slug) {
			return res.json({
				isSlugAvailable: false
			})
		}

		const isSlugAvailable = await services.agreement.isSlugAvailable({
			slugToCheck: req.body.slug,
			chainId: req.body.chainId
		})

		return res.json({
			isSlugAvailable
		})
	}

	// public static async updateAgreement(
	// 	req: IRequest<MeemAPI.v1.UpdateAgreement.IDefinition>,
	// 	res: IResponse<MeemAPI.v1.UpdateAgreement.IResponseBody>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	await req.wallet.enforceTXLimit()

	// 	const adminRole = config.ADMIN_ROLE
	// 	const agreement = await orm.models.Agreement.findOne({
	// 		where: {
	// 			id: req.params.agreementId
	// 		},
	// 		include: [
	// 			{
	// 				model: orm.models.Wallet,
	// 				where: {
	// 					address: req.wallet.address
	// 				},
	// 				through: {
	// 					where: {
	// 						role: adminRole
	// 					}
	// 				}
	// 			}
	// 		]
	// 	})

	// 	if (!agreement) {
	// 		throw new Error('MEEM_CONTRACT_NOT_FOUND')
	// 	}

	// 	if (agreement.Wallets && agreement.Wallets.length < 1) {
	// 		throw new Error('NOT_AUTHORIZED')
	// 	}

	// 	if (req.body.slug && req.body.slug !== agreement.slug) {
	// 		const isAvailable = await services.agreement.isSlugAvailable({
	// 			slugToCheck: req.body.slug,
	// 			chainId: agreement.chainId
	// 		})
	// 		if (!isAvailable) {
	// 			throw new Error('SLUG_UNAVAILABLE')
	// 		}

	// 		const slug = await services.agreement.generateSlug({
	// 			baseSlug: req.body.slug,
	// 			chainId: agreement.chainId
	// 		})

	// 		if (req.body.slug !== slug) {
	// 			throw new Error('INVALID_SLUG')
	// 		}

	// 		agreement.slug = slug
	// 	}

	// 	await agreement.save()

	// 	return res.json({
	// 		status: 'success'
	// 	})
	// }

	public static async createAgreement(
		req: IRequest<MeemAPI.v1.CreateAgreement.IDefinition>,
		res: IResponse<MeemAPI.v1.CreateAgreement.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		if (!req.body.name) {
			throw new Error('MISSING_PARAMETERS')
		}

		if (!req.body.metadata) {
			throw new Error('MISSING_PARAMETERS')
		}

		if (!req.body.metadata) {
			throw new Error('INVALID_METADATA')
		}

		await req.wallet.enforceTXLimit()

		const result = await services.agreement.createAgreement({
			...req.body,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async reInitialize(
		req: IRequest<MeemAPI.v1.ReInitializeAgreement.IDefinition>,
		res: IResponse<MeemAPI.v1.ReInitializeAgreement.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId } = req.params

		const result = await services.agreement.updateAgreement({
			...req.body,
			agreementId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async createAgreementSafe(
		req: IRequest<MeemAPI.v1.CreateAgreementSafe.IDefinition>,
		res: IResponse<MeemAPI.v1.CreateAgreementSafe.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId } = req.params

		const result = await services.agreement.createAgreementSafe({
			...req.body,
			agreementId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async upgradeAgreement(
		req: IRequest<MeemAPI.v1.UpgradeAgreement.IDefinition>,
		res: IResponse<MeemAPI.v1.UpgradeAgreement.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId } = req.params

		const result = await services.agreement.upgradeAgreement({
			...req.body,
			agreementId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async getMintingProof(
		req: IRequest<MeemAPI.v1.GetMintingProof.IDefinition>,
		res: IResponse<MeemAPI.v1.GetMintingProof.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		const { agreementId } = req.params

		const agreement = await orm.models.Agreement.findOne({
			where: {
				id: agreementId
			}
		})

		if (!agreement) {
			throw new Error('MEEM_CONTRACT_NOT_FOUND')
		}

		const { proof } = await agreement.getMintingPermission(req.wallet.address)

		return res.json({
			proof
		})
	}

	public static async bulkMint(
		req: IRequest<MeemAPI.v1.BulkMintAgreementTokens.IDefinition>,
		res: IResponse<MeemAPI.v1.BulkMintAgreementTokens.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId } = req.params

		const agreement = await orm.models.Agreement.findOne({
			where: {
				id: agreementId
			}
		})

		if (!agreement) {
			throw new Error('MEEM_CONTRACT_NOT_FOUND')
		}

		const canMint = await agreement.canMint(req.wallet.address)
		if (!canMint) {
			throw new Error('NOT_AUTHORIZED')
		}

		const result = await services.agreement.bulkMint({
			...req.body,
			mintedBy: req.wallet.address,
			agreementId
		})

		return res.json(result)
	}
}
