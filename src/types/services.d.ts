/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Child from '../services/Child'
import Data from '../services/Data'
import Ethers from '../services/Ethers'
import Lint from '../services/Lint'
import MeemId from '../services/MeemId'
import Testing from '../services/Testing'
import Types from '../services/Types'
import Web3 from '../services/Web3'

declare global {
	namespace services {
		let child: typeof Child
		let data: typeof Data
		let ethers: Ethers
		let lint: typeof Lint
		let meemId: typeof MeemId
		let testing: Testing
		let types: typeof Types
		let web3: typeof Web3
	}
}
