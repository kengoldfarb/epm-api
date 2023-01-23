import { Response } from 'express'
import { IRequest, IResponse } from '../types/app'
import { MeemAPI } from '../types/meem.generated'
export default class AgreementRoleController {
	// public static async createAgreementGuild(
	// 	req: IRequest<any>,
	// 	res: IResponse<any>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	const { agreementId } = req.params

	// 	if (!agreementId) {
	// 		throw new Error('SERVER_ERROR')
	// 	}

	// 	const agreementGuild = await services.guild.createAgreementGuild({
	// 		agreementId: agreementId as string
	// 	})

	// 	return res.json({
	// 		agreementGuild
	// 	})
	// }

	// public static async deleteAgreementGuild(
	// 	req: IRequest<any>,
	// 	res: IResponse<any>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	const { agreementId } = req.params

	// 	if (!agreementId) {
	// 		throw new Error('SERVER_ERROR')
	// 	}

	// 	const agreementGuild = await services.guild.deleteAgreementGuild({
	// 		agreementId: agreementId as string
	// 	})

	// 	return res.json({
	// 		agreementGuild
	// 	})
	// }

	public static async createAgreementRole(
		req: IRequest<MeemAPI.v1.CreateAgreementRole.IDefinition>,
		res: IResponse<MeemAPI.v1.CreateAgreementRole.IResponseBody>
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

		await req.wallet.enforceTXLimit()

		const agreement = await orm.models.Agreement.findOne({
			where: {
				id: req.params.agreementId
			},
			include: [
				{
					model: orm.models.Wallet,
					as: 'Owner'
				}
			]
		})

		if (!agreement) {
			throw new Error('AGREEMENT_NOT_FOUND')
		}

		const isAdmin = await agreement.isAdmin(req.wallet.address)

		if (!isAdmin) {
			throw new Error('NOT_AUTHORIZED')
		}

		const result = await services.agreement.createAgreement({
			...req.body,
			admins: agreement.Owner?.address ? [agreement.Owner?.address] : [],
			chainId: agreement.chainId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async reinitialize(
		req: IRequest<MeemAPI.v1.ReInitializeAgreementRole.IDefinition>,
		res: IResponse<MeemAPI.v1.ReInitializeAgreementRole.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId, agreementRoleId } = req.params

		const result = await services.agreement.reinitializeAgreementOrRole({
			...req.body,
			agreementId,
			agreementRoleId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async upgradeAgreementRole(
		req: IRequest<MeemAPI.v1.UpgradeAgreementRole.IDefinition>,
		res: IResponse<MeemAPI.v1.UpgradeAgreementRole.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId, agreementRoleId } = req.params

		const result = await services.agreement.upgradeAgreement({
			...req.body,
			agreementId,
			agreementRoleId,
			senderWalletAddress: req.wallet.address
		})

		return res.json(result)
	}

	public static async deleteAgreementRole(
		req: IRequest<MeemAPI.v1.DeleteAgreementRole.IDefinition>,
		res: IResponse<MeemAPI.v1.DeleteAgreementRole.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		const { agreementId, agreementRoleId } = req.params

		const agreement = await orm.models.Agreement.findOne({
			where: {
				id: agreementId
			}
		})

		if (!agreement) {
			throw new Error('AGREEMENT_NOT_FOUND')
		}

		const isAdmin = await agreement.isAdmin(req.wallet.address)

		if (!isAdmin) {
			throw new Error('NOT_AUTHORIZED')
		}

		const agreementRole = await orm.models.AgreementRole.findOne({
			where: {
				id: agreementRoleId
			}
		})

		if (!agreementRole) {
			throw new Error('MEEM_CONTRACT_ROLE_NOT_FOUND')
		}

		const promises: Promise<any>[] = []
		const t = await orm.sequelize.transaction()

		// if (agreementRole?.guildRoleId) {
		// 	await services.guild.deleteAgreementGuildRole({
		// 		guildRoleId: agreementRole.guildRoleId,
		// 		agreementId: agreement.id
		// 	})
		// }

		// promises.push(
		// 	orm.models.AgreementRolePermission.destroy({
		// 		where: {
		// 			AgreementRoleId: agreementRole.id
		// 		},
		// 		transaction: t
		// 	})
		// )

		promises.push(
			orm.models.AgreementRole.destroy({
				where: {
					id: agreementRole.id
				},
				transaction: t
			})
		)

		try {
			await Promise.all(promises)
			await t.commit()

			return res.json({
				status: 'success'
			})
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}

	// public static async getAgreementGuild(
	// 	req: IRequest<MeemAPI.v1.GetAgreementGuild.IDefinition>,
	// 	res: IResponse<MeemAPI.v1.GetAgreementGuild.IResponseBody>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	try {
	// 		const guildResponse = await services.guild.getAgreementGuild({
	// 			agreementId: req.params.agreementId
	// 		})

	// 		let guildPlatforms: any = guildResponse?.guildPlatforms

	// 		if (guildPlatforms) {
	// 			guildPlatforms = await Promise.all(
	// 				guildPlatforms.map(async (gp: any) => {
	// 					const gpData = gp

	// 					if (gpData.platformId === 1) {
	// 						const discordDataResponse = await request.post(
	// 							`https://api.guild.xyz/v1/discord/server/${gp.platformGuildId}`
	// 						)
	// 						gpData.platformGuildData = {
	// 							...gpData.platformGuildData,
	// 							...discordDataResponse.body
	// 						}
	// 					}

	// 					return gpData
	// 				})
	// 			)
	// 		}

	// 		const guild = guildResponse
	// 			? {
	// 					id: guildResponse.id,
	// 					name: guildResponse.name,
	// 					guildPlatforms
	// 			  }
	// 			: null

	// 		return res.json({
	// 			guild
	// 		})
	// 	} catch (e) {
	// 		log.crit(e)
	// 		throw new Error('SERVER_ERROR')
	// 	}
	// }

	public static async bulkMint(
		req: IRequest<MeemAPI.v1.BulkMintAgreementRoleTokens.IDefinition>,
		res: IResponse<MeemAPI.v1.BulkMintAgreementRoleTokens.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId, agreementRoleId } = req.params

		const agreementRole = await orm.models.AgreementRole.findOne({
			where: {
				id: agreementRoleId
			}
		})

		if (!agreementRole) {
			throw new Error('AGREEMENT_NOT_FOUND')
		}

		const canMint = await agreementRole.canMint(req.wallet.address)
		if (!canMint) {
			throw new Error('NOT_AUTHORIZED')
		}

		const { txId } = await services.agreement.bulkMint({
			...req.body,
			mintedBy: req.wallet.address,
			agreementId,
			agreementRoleId
		})

		return res.json({
			txId
		})
	}

	public static async bulkBurn(
		req: IRequest<MeemAPI.v1.BulkBurnAgreementRoleTokens.IDefinition>,
		res: IResponse<MeemAPI.v1.BulkBurnAgreementRoleTokens.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		await req.wallet.enforceTXLimit()

		const { agreementId, agreementRoleId } = req.params

		const agreementRole = await orm.models.AgreementRole.findOne({
			where: {
				id: agreementRoleId
			}
		})

		if (!agreementRole) {
			throw new Error('AGREEMENT_NOT_FOUND')
		}

		const canMint = await agreementRole.canMint(req.wallet.address)
		if (!canMint) {
			throw new Error('NOT_AUTHORIZED')
		}

		const { txId } = await services.agreement.bulkBurn({
			...req.body,
			agreementId,
			agreementRoleId
		})

		return res.json({
			txId
		})
	}

	public static async getAgreementRoles(
		req: IRequest<MeemAPI.v1.GetAgreementRoles.IDefinition>,
		res: IResponse<MeemAPI.v1.GetAgreementRoles.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		try {
			const roles = await services.agreement.getAgreementRoles({
				agreementId: req.params.agreementId
			})
			return res.json({
				roles
			})
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}

	public static async getAgreementRole(
		req: IRequest<MeemAPI.v1.GetAgreementRole.IDefinition>,
		res: IResponse<MeemAPI.v1.GetAgreementRole.IResponseBody>
	): Promise<Response> {
		if (!req.wallet) {
			throw new Error('USER_NOT_LOGGED_IN')
		}

		try {
			const roles = await services.agreement.getAgreementRoles({
				agreementId: req.params.agreementId,
				agreementRoleId: req.params.agreementRoleId
			})
			return res.json({
				role: roles[0]
			})
		} catch (e) {
			log.crit(e)
			throw new Error('SERVER_ERROR')
		}
	}

	// public static async getUserAgreementRolesAccess(
	// 	req: IRequest<MeemAPI.v1.GetUserAgreementRolesAccess.IDefinition>,
	// 	res: IResponse<MeemAPI.v1.GetUserAgreementRolesAccess.IResponseBody>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	try {
	// 		const rolesAccess = await services.agreement.getUserAgreementRolesAccess({
	// 			agreementId: req.params.agreementId,
	// 			walletAddress: req.wallet.address
	// 		})
	// 		return res.json(rolesAccess)
	// 	} catch (e) {
	// 		log.crit(e)
	// 		throw new Error('SERVER_ERROR')
	// 	}
	// }

	// public static async getJoinGuildMessage(
	// 	req: IRequest<MeemAPI.v1.GetJoinGuildMessage.IDefinition>,
	// 	res: IResponse<MeemAPI.v1.GetJoinGuildMessage.IResponseBody>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	const agreement = await orm.models.Agreement.findOne({
	// 		where: {
	// 			id: req.params.agreementId
	// 		},
	// 		include: [
	// 			{
	// 				model: orm.models.AgreementGuild
	// 			}
	// 		]
	// 	})

	// 	if (!agreement || !agreement.AgreementGuild) {
	// 		throw new Error('AGREEMENT_NOT_FOUND')
	// 	}

	// 	const payload = {
	// 		guildId: agreement.AgreementGuild.guildId,
	// 		platforms: []
	// 	}
	// 	const msg = 'Please sign this message.'
	// 	const chainId = undefined // services.guild.getGuildChain(agreement.chainId)
	// 	const addr = req.wallet.address
	// 	const method = 1 // Guild method for authentication
	// 	const nonce = randomBytes(32).toString('base64')
	// 	const hash =
	// 		Object.keys(payload).length > 0
	// 			? keccak256(toUtf8Bytes(JSON.stringify(payload)))
	// 			: undefined
	// 	const ts = Date.now().toString()

	// 	const messageToSign = `${msg}\n\nAddress: ${addr}\nMethod: ${method}${
	// 		chainId ? `\nChainId: ${chainId}` : ''
	// 	}${hash ? `\nHash: ${hash}` : ''}\nNonce: ${nonce}\nTimestamp: ${ts}`

	// 	return res.json({
	// 		message: messageToSign,
	// 		params: { chainId, msg, method, addr, nonce, hash, ts }
	// 	})
	// }

	// public static async joinAgreementGuild(
	// 	req: IRequest<MeemAPI.v1.JoinGuild.IDefinition>,
	// 	res: IResponse<MeemAPI.v1.JoinGuild.IResponseBody>
	// ): Promise<Response> {
	// 	if (!req.wallet) {
	// 		throw new Error('USER_NOT_LOGGED_IN')
	// 	}

	// 	const agreement = await orm.models.Agreement.findOne({
	// 		where: {
	// 			id: req.params.agreementId
	// 		},
	// 		include: [
	// 			{
	// 				model: orm.models.AgreementGuild
	// 			}
	// 		]
	// 	})

	// 	if (!agreement || !agreement.AgreementGuild) {
	// 		throw new Error('AGREEMENT_NOT_FOUND')
	// 	}

	// 	// If user does not have a token, mint it before joining guild or request will fail.
	// 	if (req.body.mintToken) {
	// 		try {
	// 			await services.meem.mintOriginalMeem({
	// 				agreementAddress: agreement.address,
	// 				to: req.wallet.address.toLowerCase(),
	// 				metadata: agreement.metadata,
	// 				mintedBy: req.wallet.address.toLowerCase(),
	// 				chainId: agreement.chainId
	// 			})
	// 		} catch (e) {
	// 			log.crit(e)
	// 			sockets?.emitError(config.errors.MINT_FAILED, req.wallet.address)
	// 		}
	// 	}

	// 	try {
	// 		const response = await request
	// 			.post(`https://api.guild.xyz/v1/user/join`)
	// 			.send({
	// 				payload: {
	// 					guildId: agreement.AgreementGuild.guildId,
	// 					platforms: []
	// 				},
	// 				params: req.body.params,
	// 				sig: req.body.sig
	// 			})

	// 		log.debug(response.body)
	// 	} catch (e) {
	// 		log.crit(e)
	// 		throw new Error('SERVER_ERROR')
	// 	}

	// 	return res.json({
	// 		status: 'success'
	// 	})
	// }
}
