import { IError, HttpMethod, IApiResponseBody } from '../../api.shared'

export namespace GetDiscordEmojis {
	export interface IPathParams {}

	export const path = () => '/api/1.0/discord/emojis'

	export const method = HttpMethod.Get

	export interface IQueryParams {
		agreementDiscordId: string
	}

	export interface IRequestBody {}

	export interface IResponseBody extends IApiResponseBody {
		emojis: {
			id: string
			name: string
		}[]
	}

	export interface IDefinition {
		pathParams: IPathParams
		queryParams: IQueryParams
		requestBody: IRequestBody
		responseBody: IResponseBody
	}

	export type Response = IResponseBody | IError
}
