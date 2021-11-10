/* eslint-disable no-new */
/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace MeemAPI {
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

	export enum License {
		Cc0 = 'cc0',
		Unknown = 'unknown'
	}

	export interface IWhitelist {
		[contractAddress: string]: IWhitelistItem
	}

	export interface IWhitelistItem {
		/** The NFT name */
		name: string

		/** The name of the original NFT creator */
		creator: string

		/** The license */
		license: License

		/** Link to the terms and conditions */
		terms: string

		/** Link to the NFT website */
		website: string
	}

	/** The zero address. Used in Meems to denote fields that are not set. */
	export const zeroAddress = '0x0000000000000000000000000000000000000000'

	/** The chain id corresponding to the smart contract */
	export enum Chain {
		Ethereum,
		Polygon,
		Cardano,
		Solana
	}

	/** The permission type corresponding to the smart contract */
	export enum PermissionType {
		Copy,
		Remix,
		Read
	}

	/** The permission corresponding to the smart contract */
	export enum Permission {
		Owner,
		Anyone,
		Addresses,
		Holders
	}

	/** The propety type corresponding to the smart contract */
	export enum PropertyType {
		Meem,
		Child
	}

	/** Various eth-like chains and their corresponding ids */
	export enum NetworkChainId {
		Mainnet = 1,
		Rinkeby = 4,
		Polygon = 137,
		Mumbai = 80001
	}

	/** The network name as expected by ethers.providers.InfuraProvider */
	export enum NetworkName {
		Mainnet = 'homestead',
		Rinkeby = 'rinkeby',
		Polygon = 'matic',
		Mumbai = 'mumbai'
	}

	/** Convert Chain to NetworkName */
	export const chainToNetworkName = (chain: Chain): NetworkName => {
		switch (chain) {
			case Chain.Ethereum:
				return NetworkName.Mainnet

			case Chain.Polygon:
				return NetworkName.Polygon

			default:
				throw new Error('INVALID_CHAIN')
		}
	}

	/** A single split */
	export interface IMeemSplit {
		toAddress: string
		amount: number
		lockedBy: string
	}

	export interface IMeemMetadata {
		name: string
		description: string
		external_url: string
		image: string
		image_original: string
		attributes: any[]
		meem_properties: {
			generation: number
			root_token_uri: string
			root_token_address: string
			root_token_id: number | null
			root_token_metadata: any
			parent_token_uri: any | null
			parent_token_address: string | null
			parent_token_id: number | null
			parent_token_metadata: any | null
		}
	}

	export interface IMeemPermission {
		permission: Permission
		addresses: string[]
		numTokens: number
		lockedBy: string
	}

	export interface IMeemProperties {
		totalChildren: number
		totalChildrenLockedBy: string
		childrenPerWallet: number
		childrenPerWalletLockedBy: string
		copyPermissions: IMeemPermission[]
		remixPermissions: IMeemPermission[]
		readPermissions: IMeemPermission[]
		copyPermissionsLockedBy: string
		remixPermissionsLockedBy: string
		readPermissionsLockedBy: string
		splits: IMeemSplit[]
		splitsLockedBy: string
	}

	export interface IMeem {
		owner: string
		tokenURI?: string
		chain: Chain
		parent: string
		parentTokenId: number
		root: string
		rootTokenId: number
		properties: IMeemProperties
		childProperties: IMeemProperties
	}

	export interface IERC721Metadata {
		name?: string
		image?: string
		description?: string
	}

	export namespace v1 {
		/** Create Meem Image */
		export namespace CreateMeemImage {
			export interface IPathParams {}

			export const path = () => `/api/1.0/meems/create-image`

			export const method = HttpMethod.Post

			export interface IQueryParams {}

			export interface IRequestBody {
				tokenAddress?: string
				tokenId?: number
				chain?: number
				base64Image?: string
				imageUrl?: string
				useTestnet?: boolean
			}

			export interface IResponseBody extends IApiResponseBody {
				image: string
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		/** Get Config */
		export namespace GetConfig {
			export interface IPathParams {}

			export const path = () => '/api/1.0/config'

			export const method = HttpMethod.Get

			export interface IQueryParams {}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		/** Get Info about Token */
		export namespace GetIPFSFile {
			export interface IPathParams {}

			export const path = () => `/api/1.0/ipfs`

			export const method = HttpMethod.Get

			export interface IQueryParams {
				filename: string
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

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
				meem: IMeem
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		/** Get Info about Token */
		export namespace GetTokenInfo {
			export interface IPathParams {}

			export const path = () => `/api/1.0/tokenInfo`

			export const method = HttpMethod.Get

			export interface IQueryParams {
				address: string
				tokenId: number
				networkName: NetworkName
			}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				owner: string
				tokenURI: string
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}

		/** Get whitelisted NFT contracts */
		export namespace GetWhitelist {
			export interface IPathParams {}

			export const path = () => `/api/1.0/whitelist`

			export const method = HttpMethod.Get

			export interface IQueryParams {}

			export interface IRequestBody {}

			export interface IResponseBody extends IApiResponseBody {
				whitelist: {
					[contractAddress: string]: IWhitelistItem
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

		/** Mint a new Meem */
		export namespace MintMeem {
			export interface IPathParams {}

			export const path = () => `/api/1.0/meems/mint`

			export const method = HttpMethod.Post

			export interface IQueryParams {}

			export interface IRequestBody {
				/** The contract address of the original NFT that is being minted as a Meem */
				tokenAddress: string

				/** The tokenId of the original NFT */
				tokenId: number

				/** The chain where the original NFT lives */
				chain: Chain

				/** The address of the original NFT owner. Also where the Meem will be minted to. */
				accountAddress: string

				properties?: Partial<IMeemProperties>

				childProperties?: Partial<IMeemProperties>

				/** Set to true to disable ownership checks. This option is only respected on testnet. */
				shouldIgnoreOwnership?: boolean

				/** Set to true to disable whitelist checks. This option is only respected on testnet */
				shouldIgnoreWhitelist?: boolean
			}

			export interface IResponseBody extends IApiResponseBody {
				transactionHash: string
				tokenId: number
			}

			export interface IDefinition {
				pathParams: IPathParams
				queryParams: IQueryParams
				requestBody: IRequestBody
				responseBody: IResponseBody
			}

			export type Response = IResponseBody | IError
		}
	}
}
