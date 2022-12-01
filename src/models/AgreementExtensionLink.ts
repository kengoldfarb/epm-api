import { DataTypes } from 'sequelize'
import { BaseModel } from '../core/BaseModel'
import type { IModels } from '../types/models'
import Agreement from './Agreement'
export default class AgreementExtensionLink extends BaseModel<AgreementExtensionLink> {
	public static readonly modelName = 'AgreementExtensionLink'

	public static readonly paranoid: boolean = false

	public static get indexes() {
		return [
			{
				name: 'AgreementExtensionLink_createdAt',
				fields: ['createdAt']
			}
		]
	}

	public static readonly attributes = {
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		isEnabled: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: ''
		},
		label: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}

	public id!: string

	public isEnabled!: boolean

	public url!: string

	public label!: string | null

	public AgreementExtensionId!: string

	public AgreementExtension!: Agreement

	public static associate(models: IModels) {
		this.belongsTo(models.AgreementExtension)
	}
}
