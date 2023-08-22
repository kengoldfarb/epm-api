import { IError, HttpMethod, IApiResponseBody, IUser } from '../../api.shared'

/** Get the current authenticated user */
export namespace GetMe {
	export interface IPathParams {}

	export const path = () => `/api/1.0/me`

	export const method = HttpMethod.Get

	export interface IQueryParams {}

	export interface IRequestBody {}

	export interface IResponseBody extends IApiResponseBody {
		/** The authenticated user's wallet id */
		walletId: string

		/** The authenticated user's wallet address */
		address: string

		/** The authenticated user */
		user: IUser
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
