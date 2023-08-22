import type { ethers as Ethers } from 'ethers'

export default class Web3 {
	public static gweiToWei(gwei: number | Ethers.BigNumber): Ethers.BigNumber {
		const ethers = services.ethers.getInstance()
		return ethers.BigNumber.from(gwei).mul(1000000000)
	}

	public static weiToGwei(gwei: number | Ethers.BigNumber): Ethers.BigNumber {
		const ethers = services.ethers.getInstance()
		return ethers.BigNumber.from(gwei).div(1000000000)
	}

	public static toBigNumber(val: Ethers.BigNumberish): Ethers.BigNumber {
		const ethers = services.ethers.getInstance()
		const bn = ethers.BigNumber.from(val.toString())
		return bn
	}
}
