/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ethers } from 'ethers'
import { chains } from '../lib/chains'

export default class EthersService {
	public static shouldInitialize = true

	// private providers: Record<number, ethers.providers.Provider> = {}
	private providers: Record<
		number,
		{ provider: ethers.providers.JsonRpcProvider }
	> = {}

	private ethers: typeof ethers

	public constructor() {
		this.ethers = require('ethers').ethers
		this.ethers.utils.Logger.setLogLevel(this.ethers.utils.Logger.levels.ERROR)
	}

	public getInstance() {
		return this.ethers
	}

	public async lookupAddress(address: string) {
		try {
			const provider = new ethers.providers.JsonRpcProvider(
				config.JSON_RPC_MAINNET
			)

			const resolvedAddress = await provider.lookupAddress(address)

			return resolvedAddress
		} catch (e) {
			log.debug(e)
		}

		return null
	}

	public async getProvider(options: { chainId: ethers.BigNumberish }) {
		const chainId = ethers.BigNumber.from(options.chainId)
		const chainIdNum = chainId.toNumber()

		const chainItem = chains.find(c => c.chainId === chainIdNum)

		if (!chainItem) {
			throw new Error('INVALID_NETWORK')
		}

		const provider = new ethers.providers.JsonRpcProvider(chainItem.rpc[0])

		this.providers[chainIdNum] = { provider }

		return { provider }
	}

	public getSelectors(abi: any[]): string[] {
		const ethersInstance = this.getInstance()

		const functions = abi.filter(a => a.type === 'function')
		const abiInterface = new ethersInstance.utils.Interface(abi)
		const sigHashes: string[] = []
		functions.forEach(f => {
			sigHashes.push(
				abiInterface.getSighash(ethersInstance.utils.Fragment.from(f))
			)
		})

		return sigHashes
	}
}
