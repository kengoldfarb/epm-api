import { IError, HttpMethod, IApiResponseBody } from '../api.shared'

/** Get Meem */
export namespace GetMeem {
	export interface IPathParams {
		/** The token id to fetch */
		tokenId: string
	}

	export const path = (options: IPathParams) =>
		`/api/1.0/meems/${options.tokenId}`

	export const method = HttpMethod.Get

	export interface IQueryParams {}

	export interface IRequestBody {}

	export interface IResponseBody extends IApiResponseBody {
		meem: {
			chain: number
		}
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
