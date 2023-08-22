export interface IError {
	status: string
	code: string
	reason: string
	friendlyReason: string
}

export enum HttpMethod {
	Get = 'GET',
	Post = 'POST',
	Patch = 'PATCH',
	Put = 'PUT',
	Options = 'OPTIONS',
	Delete = 'DELETE'
}

export interface IApiResponseBody {
	apiVersion: string
}

export interface IApiPaginatedResponseBody extends IApiResponseBody {
	totalItems: number
	itemsPerPage: number
}

/** The source of the event. Who emits the event. */
export enum EventSource {
	Server = 'server',
	Client = 'client'
}

export interface IEvent {
	key: string
	data?: Record<string, any>
}

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
	T extends (...args: any) => Promise<infer R> ? R : any

export interface IRequestPaginated {
	/** The current page to fetch. Page starts at 0 index */
	page?: number

	/** The number of records to fetch */
	limit?: number
}

/** The zero address. Used to denote fields that are not set. */
export const zeroAddress = '0x0000000000000000000000000000000000000000'

export enum SortOrder {
	Asc = 'asc',
	Desc = 'desc'
}

export enum ContractType {
	Regular = 'regular',
	DiamondProxy = 'diamondProxy',
	DiamondFacet = 'diamondFacet'
}

export interface IUser {
	id: string
	displayName: string
	profilePicUrl: string
	DefaultWalletId: string
	Wallets: {
		id: string
		address: string
		ens: string
	}[]
	DefaultWallet: {
		id: string
		address: string
		ens: string
	}
}
