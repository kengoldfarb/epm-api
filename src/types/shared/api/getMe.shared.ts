import { IError, HttpMethod, IApiResponseBody } from '../api.shared'
import { IMeemId } from '../meem.shared'

export namespace GetMeemId {
	export interface IPathParams {}

	export const path = () => `/api/1.0/me`

	export const method = HttpMethod.Get

	export interface IQueryParams {}

	export interface IRequestBody {}

	export interface IResponseBody extends IApiResponseBody {
		/** The MeemId */
		meemId: IMeemId
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
