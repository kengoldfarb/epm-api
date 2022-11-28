import coreExpress, { Express } from 'express'
import AgreementController from '../controllers/AgreementController'
import AgreementExtensionController from '../controllers/AgreementExtensionController'
import AgreementRoleController from '../controllers/AgreementRoleController'
import ConfigController from '../controllers/ConfigController'
import ContractController from '../controllers/ContractController'
import DiscordController from '../controllers/DiscordController'
import MeemController from '../controllers/MeemController'
import MeemIdController from '../controllers/MeemIdController'
import TestController from '../controllers/TestController'
import TypesController from '../controllers/TypesController'
import extendedRouter from '../core/router'
import userLoggedInPolicy from '../policies/UserLoggedInPolicy'

export default (app: Express, _express: typeof coreExpress) => {
	const router = extendedRouter()
	const imageRouter = extendedRouter()

	app.use('/api/1.0/', router)
	app.use('/images/1.0/', imageRouter)

	/** Current User Routes */

	router.getAsync('/me', MeemIdController.getMe)
	router.postAsync('/me', MeemIdController.createOrUpdateUser)
	router.deleteAsync(
		'/me/integrations/:integrationId',
		MeemIdController.detachUserIdentity
	)
	router.postAsync('/me/refreshENS', MeemIdController.refreshENS)
	router.getAsync('/me/apiKey', MeemIdController.getApiKey)
	router.postAsync(
		'/me/integrations/:integrationId',
		MeemIdController.updateUserIdentity
	)

	/** Agreements and Roles Routes */

	router.postAsync('/agreements', AgreementController.createAgreement)
	router.postAsync(
		'/agreements/isSlugAvailable',
		AgreementController.isSlugAvailable
	)
	router.postAsync(
		'/agreements/:agreementId/reinitialize',
		AgreementController.reInitialize
	)
	router.postAsync(
		'/agreements/:agreementId/safe',
		AgreementController.createClubSafe
	)
	router.postAsync(
		'/agreements/:agreementId/bulkMint',
		AgreementController.bulkMint
	)
	router.postAsync(
		'/agreements/:agreementId/upgrade',
		AgreementController.upgradeAgreement
	)
	router.getAsync(
		'/agreements/:agreementId/proof',
		AgreementController.getMintingProof
	)
	router.postAsync(
		'/agreements/:agreementId/extensions',
		AgreementExtensionController.createAgreementExtension
	)
	router.putAsync(
		'/agreements/:agreementId/extensions/:slug',
		AgreementExtensionController.updateAgreementExtension
	)
	router.getAsync(
		'/agreements/:agreementId/roles',
		AgreementRoleController.getAgreementRoles
	)
	router.getAsync(
		'/agreements/:agreementId/roles/:agreementRoleId',
		AgreementRoleController.getAgreementRole
	)
	router.postAsync(
		'/agreements/:agreementId/roles',
		AgreementRoleController.createAgreementRole
	)
	// router.postAsync(
	// 	'/agreements/:agreementId/roles/:agreementRoleId',
	// 	AgreementRoleController.updateAgreementRole
	// )
	// router.deleteAsync(
	// 	'/agreements/:agreementId/roles/:agreementRoleId',
	// 	AgreementRoleController.deleteAgreementRole
	// )
	router.postAsync(
		'/agreements/:agreementId/roles/:agreementRoleId/bulkMint',
		AgreementRoleController.bulkMint
	)

	/** EPM Routes */

	router.postAsync(
		'/epm/contracts',
		userLoggedInPolicy,
		ContractController.createContract
	)
	router.postAsync(
		'/epm/contractInstances',
		userLoggedInPolicy,
		ContractController.addContractInstance
	)
	router.postAsync(
		'/epm/bundles',
		userLoggedInPolicy,
		ContractController.createBundle
	)
	router.putAsync(
		'/epm/bundles/:bundleId',
		userLoggedInPolicy,
		ContractController.updateBundle
	)
	router.patchAsync(
		'/epm/walletContractInstances/:contractInstanceId',
		userLoggedInPolicy,
		ContractController.updateWalletContractInstance
	)

	/** Discord Routes */

	router.postAsync('/discord/authenticate', DiscordController.authenticate)
	router.getAsync('/discord/servers', DiscordController.getGuilds)

	/** Misc Routes */

	router.getAsync('/config', ConfigController.getConfig)
	router.getAsync('/getNonce', MeemIdController.getNonce)
	router.postAsync('/login', MeemIdController.login)
	router.getAsync('/ipfs', MeemController.getIPFSFile)
	router.postAsync('/generateTypes', TypesController.generateTypes)

	/** Test Routes */

	if (config.ENABLE_TEST_ENDPOINTS) {
		router.getAsync('/test/emit', TestController.testEmit)
		router.getAsync('/test/error', TestController.testError)
		router.getAsync('/test/wrapped', TestController.testWrapped)
		router.getAsync(
			'/test/saveSubscription',
			TestController.testSaveSubscription
		)
		router.getAsync(
			'/test/getSubscriptions',
			TestController.testGetSubscriptions
		)
		router.getAsync('/test/getUserJWT', TestController.testGetUserJWT)
		router.getAsync('/test/gnosis', TestController.testGnosis)
		router.getAsync('/test/testCron', TestController.testCron)
		router.getAsync('/test/syncContract', TestController.syncContract)
		router.getAsync('/test/metadata', TestController.metadata)
		router.getAsync('/test/hash', TestController.testHash)
		router.getAsync('/test/releaseLock', TestController.releaseLock)
		router.getAsync('/test/mintPKP', TestController.mintPKP)
		router.getAsync('/test/getEthAddress', TestController.getEthAddress)
		router.getAsync('/test/txEncoding', TestController.testTxEncoding)
	}
}
