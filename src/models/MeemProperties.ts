import { DataTypes } from 'sequelize'
import { BaseModel } from '../core/BaseModel'
import { MeemAPI } from '../types/meem.generated'
import type { IModels } from '../types/models'

export default class MeemProperties extends BaseModel<MeemProperties> {
	public static readonly modelName = 'MeemProperties'

	public static get indexes() {
		return []
	}

	public static readonly attributes = {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		totalRemixes: {
			type: DataTypes.STRING,
			allowNull: false,
			set(this: MeemProperties, val: any) {
				this.setDataValue(
					'totalRemixes',
					services.web3.toBigNumber(val).toHexString()
				)
			}
		},
		totalRemixesLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		remixesPerWallet: {
			type: DataTypes.STRING,
			allowNull: false,
			set(this: MeemProperties, val: any) {
				this.setDataValue(
					'remixesPerWallet',
					services.web3.toBigNumber(val).toHexString()
				)
			}
		},
		remixesPerWalletLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		totalCopies: {
			type: DataTypes.STRING,
			allowNull: false,
			set(this: MeemProperties, val: any) {
				this.setDataValue(
					'totalCopies',
					services.web3.toBigNumber(val).toHexString()
				)
			}
		},
		totalCopiesLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		copiesPerWallet: {
			type: DataTypes.STRING,
			allowNull: false,
			set(this: MeemProperties, val: any) {
				this.setDataValue(
					'copiesPerWallet',
					services.web3.toBigNumber(val).toHexString()
				)
			}
		},
		copiesPerWalletLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		copyPermissions: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		remixPermissions: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		readPermissions: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		copyPermissionsLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		remixPermissionsLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		readPermissionsLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		},
		splits: {
			type: DataTypes.JSONB,
			allowNull: false
		},
		splitsLockedBy: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}

	public id!: string

	public totalRemixes!: string

	public totalRemixesLockedBy!: string

	public remixesPerWallet!: string

	public remixesPerWalletLockedBy!: string

	public totalCopies!: string

	public totalCopiesLockedBy!: string

	public copiesPerWallet!: string

	public copiesPerWalletLockedBy!: string

	public copyPermissions!: MeemAPI.IMeemPermission[]

	public remixPermissions!: MeemAPI.IMeemPermission[]

	public readPermissions!: MeemAPI.IMeemPermission[]

	public copyPermissionsLockedBy!: string

	public remixPermissionsLockedBy!: string

	public readPermissionsLockedBy!: string

	public splits!: MeemAPI.IMeemSplit[]

	public splitsLockedBy!: string

	public static associate(_models: IModels) {}
}
