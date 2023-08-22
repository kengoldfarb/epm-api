import { DataTypes } from 'sequelize'
import ModelWithAddress from '../core/ModelWithAddress'
import type { IModels } from '../types/models'
import User from './User'

export default class Wallet extends ModelWithAddress<Wallet> {
	public static readonly modelName = 'Wallet'

	public static readonly paranoid: boolean = false

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
		apiKey: {
			type: DataTypes.UUID
		},
		ens: {
			type: DataTypes.STRING
		},
		ensFetchedAt: {
			type: DataTypes.DATE
		},
		dailyTXLimit: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 5
		},
		pkpTokenId: {
			type: DataTypes.STRING
		}
	}

	public id!: string

	public address!: string

	public nonce!: string | null

	public apiKey!: string | null

	public ens!: string | null

	public ensFetchedAt!: Date | null

	public dailyTXLimit!: number

	public pkpTokenId!: string | null

	public UserId!: string | null

	public User!: User

	public static associate(models: IModels) {
		this.belongsTo(models.User)
	}

	public static async getByJWT(jwt: string) {
		const jwtData = services.meemId.verifyJWT(jwt)
		if (jwtData.walletAddress) {
			const wallet = await orm.models.Wallet.findOne({
				where: {
					address: jwtData.walletAddress
				}
			})
			return wallet
		}

		return null
	}
}
