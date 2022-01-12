import { IError, HttpMethod, IApiResponseBody } from '../api.shared'
import { IMetadataMeem } from '../meem.shared'

/** Get Meem */
export namespace GetMeems {
	export interface IPathParams {}

	export const path = (options: IPathParams) => `/api/1.0/meems`

	export const method = HttpMethod.Get

	export interface IQueryParams {
		meemId?: string
	}

	export interface IRequestBody {}

	export interface IResponseBody extends IApiResponseBody {
		meems: IMetadataMeem[]
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
