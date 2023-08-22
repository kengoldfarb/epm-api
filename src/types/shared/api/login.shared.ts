import { IError, HttpMethod, IApiResponseBody } from '../api.shared'

/** Log in a user. */
export namespace Login {
	export interface IPathParams {}

	export const path = () => `/api/1.0/login`

	export const method = HttpMethod.Post

	export interface IQueryParams {}
	export interface IRequestBody {
		/** Login w/ access token provided by Auth0 magic link */
		accessToken?: string

		/** Login w/ wallet. Both message and signature must be provided */
		message?: string

		/** Login w/ wallet. Both message and signature must be provided */
		signature?: string

		/** Whether to connect the login method with the currently authenticated user */
		shouldConnectUser?: boolean
	}

	export interface IResponseBody extends IApiResponseBody {
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
