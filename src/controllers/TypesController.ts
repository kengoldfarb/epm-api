import { Response } from 'express'
import { API } from '../types/api.generated'
import { IRequest, IResponse } from '../types/app'
export default class TypesController {
	public static async generateTypes(
		req: IRequest<API.v1.GenerateTypes.IDefinition>,
		res: IResponse<API.v1.GenerateTypes.IResponseBody>
	): Promise<Response> {
		const { types, abi } = await services.types.generateContractTypes(req.body)

		return res.json({
			types,
			abi
		})
	}
}
