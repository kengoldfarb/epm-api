import { IError, HttpMethod, IApiResponseBody } from '../api.shared'
import { IMeemId } from '../meem.shared'

export namespace CreateOrUpdateMeemId {
	export interface IPathParams {}

	export const path = () => `/api/1.0/meemId`

	export const method = HttpMethod.Post

	export interface IQueryParams {}

	export interface IRequestBody {
		/** Wallet address to add or lookup by */
		address: string
		/** Signature of wallet address */
		signature: string

		/** Twitter account to add or lookup by */
		twitterAccessToken: string
		/** Twitter account to add or lookup by */
		twitterAccessSecret: string
	}

	export interface IResponseBody extends IApiResponseBody {
		/** The MeemId */
		meemId: IMeemId
		/** JWT that can be used for future authentication */
		jwt: string
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
