import Bundle from '../models/Bundle'
import BundleContract from '../models/BundleContract'
import Contract from '../models/Contract'
import ContractInstance from '../models/ContractInstance'
import User from '../models/User'
import Wallet from '../models/Wallet'
import WalletContractInstance from '../models/WalletContractInstance'

export interface IModels {
	Bundle: typeof Bundle
	BundleContract: typeof BundleContract
	Contract: typeof Contract
	ContractInstance: typeof ContractInstance
	User: typeof User
	Wallet: typeof Wallet
	WalletContractInstance: typeof WalletContractInstance
}

export type AppModel = IModels[keyof IModels]
