import coreExpress, { Express } from 'express'
import ConfigController from '../controllers/ConfigController'
import EPMController from '../controllers/EPMController'
import MeemIdController from '../controllers/MeemIdController'
import TypesController from '../controllers/TypesController'
import extendedRouter from '../core/router'
import userLoggedInPolicy from '../policies/UserLoggedInPolicy'

export default (app: Express, _express: typeof coreExpress) => {
	const router = extendedRouter()
	const imageRouter = extendedRouter()

	app.use('/api/1.0/', router)
	app.use('/images/1.0/', imageRouter)

	/** Auth Routes */

	router.postAsync('/login', MeemIdController.login)

	/** Current User Routes */

	router.getAsync('/me', MeemIdController.getMe)
	router.postAsync('/me', MeemIdController.createOrUpdateUser)
	router.postAsync('/me/refreshENS', MeemIdController.refreshENS)
	router.getAsync('/me/apiKey', MeemIdController.getApiKey)

	/** EPM Routes */

	router.postAsync(
		'/contracts',
		userLoggedInPolicy,
		EPMController.createContract
	)
	router.postAsync(
		'/contractInstances',
		userLoggedInPolicy,
		EPMController.addContractInstance
	)
	router.postAsync('/bundles', userLoggedInPolicy, EPMController.createBundle)
	router.putAsync(
		'/bundles/:bundleId',
		userLoggedInPolicy,
		EPMController.updateBundle
	)
	router.patchAsync(
		'/walletContractInstances/:contractInstanceId',
		userLoggedInPolicy,
		EPMController.updateWalletContractInstance
	)

	router.getAsync('/config', ConfigController.getConfig)
	router.postAsync('/generateTypes', TypesController.generateTypes)
}
