import { Op, DataTypes } from 'sequelize'
import { BaseModel } from '../core/BaseModel'
import type { IModels } from '../types/models'
import type MeemIdentification from './MeemIdentification'

export default class Wallet extends BaseModel<Wallet> {
	public static readonly modelName = 'Wallet'

	public static get indexes() {
		return []
	}

	public static readonly attributes = {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		address: {
			type: DataTypes.STRING,
			allowNull: false
		},
		nonce: {
			type: DataTypes.STRING
		},
		isDefault: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}

	public static async findAllByAddresses(addresses: string[]) {
		const result = await orm.models.Wallet.findAll({
			where: orm.sequelize.where(
				orm.sequelize.fn('lower', orm.sequelize.col('address')),
				{ [Op.in]: addresses.map(w => w.toLowerCase()) }
			)
		})

		return result
	}

	public static async findByAddress(address: string) {
		const result = await orm.models.Wallet.findOne({
			where: orm.sequelize.where(
				orm.sequelize.fn('lower', orm.sequelize.col('address')),
				address.toLowerCase()
			)
		})

		return result
	}

	public id!: string

	public address!: string

	public nonce!: string | null

	public isDefault!: boolean

	public MeemIdentification!: MeemIdentification | null

	public MeemIdentificationId!: string | null

	public static associate(models: IModels) {
		this.belongsTo(models.MeemIdentification)
	}
}
