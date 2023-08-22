import path from 'path'
import errors from './errors'

// eslint-disable-next-line
const packageJSON = require(path.join(process.cwd(), 'package.json'))

export default {
	version: packageJSON.version as string,
	errors,
	PORT: process.env.PORT ?? 1313,
	API_URL: process.env.API_URL ?? 1313,
	SERVER_LISTENING: process.env.SERVER_LISTENING !== 'false',
	SERVER_ADMIN_KEY: process.env.SERVER_ADMIN_KEY ?? 'xGugNAB2PEX4uY4sPF',
	JWT_SECRET: process.env.JWT_SECRET ?? '',
	JWT_RSA_PUBLIC_KEY: process.env.JWT_RSA_PUBLIC_KEY ?? '',
	JWT_RSA_PRIVATE_KEY: process.env.JWT_RSA_PRIVATE_KEY ?? '',
	JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN
		? +process.env.JWT_EXPIRES_IN
		: 604800, // 7 days
	SERVERLESS: process.env.SERVERLESS === 'true',
	LOG_LEVEL: process.env.LOG_LEVEL ?? 'warn',
	ENABLE_REQUEST_LOGGING: process.env.ENABLE_REQUEST_LOGGING === 'true',
	GENERATE_SHARED_TYPES: process.env.GENERATE_SHARED_TYPES === 'true',
	TESTING: process.env.TESTING === 'true',
	DATABASE_URL: process.env.DATABASE_URL ?? 'sqlite::memory:',
	DISABLE_MIGRATIONS: process.env.DISABLE_MIGRATIONS === 'true',
	DISABLE_ORM_SYNC: process.env.DISABLE_ORM_SYNC === 'true',
	DATABASE_POOL_MAX: process.env.DATABASE_POOL_MAX
		? +process.env.DATABASE_POOL_MAX
		: 5,
	DATABASE_POOL_MIN: process.env.DATABASE_POOL_MIN
		? +process.env.DATABASE_POOL_MIN
		: 0,
	DATABASE_POOL_IDLE: process.env.DATABASE_POOL_IDLE
		? +process.env.DATABASE_POOL_IDLE
		: 10000,
	ORM_DISABLE: process.env.ORM_DISABLE === 'true',
	ORM_FORCE_SYNC: process.env.ORM_FORCE_SYNC === 'true',
	ORM_DISABLE_SSL: process.env.ORM_DISABLE_SSL === 'true',
	ORM_ALLOW_UNAUTHORIZED: process.env.ORM_ALLOW_UNAUTHORIZED === 'true',
	ORM_LOGGING: process.env.ORM_LOGGING === 'true',
	DOTENV_DEBUG: process.env.DOTENV_DEBUG === 'true',
	CORS_ALLOW_ALL: process.env.CORS_ALLOW_ALL === 'true',
	CORS_DEFAULT_ORIGIN: process.env.CORS_DEFAULT_ORIGIN ?? 'epm.wtf',
	CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS
		? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
		: ['epm.wtf'],
	AWS_WEBSOCKET_GATEWAY_URL: process.env.AWS_WEBSOCKET_GATEWAY_URL,
	SERVERLESS_LOG_FULL_REQUEST: process.env.SERVERLESS_LOG_FULL_REQUEST,
	APP_AWS_ACCESS_KEY_ID: process.env.APP_AWS_ACCESS_KEY_ID ?? '',
	APP_AWS_SECRET_ACCESS_KEY: process.env.APP_AWS_SECRET_ACCESS_KEY ?? '',
	ENABLE_TEST_ENDPOINTS: process.env.ENABLE_TEST_ENDPOINTS === 'true',
	WEBSOCKETS_ENABLED: process.env.WEBSOCKETS_ENABLED === 'true',
	ENABLE_VERBOSE_ERRORS: process.env.ENABLE_VERBOSE_ERRORS === 'true',
	DEFAULT_PAGINATION_LIMIT: process.env.DEFAULT_PAGINATION_LIMIT
		? +process.env.DEFAULT_PAGINATION_LIMIT
		: 20,
	PG_LOCK_RETRY_COUNT: process.env.PG_LOCK_RETRY_COUNT
		? +process.env.PG_LOCK_RETRY_COUNT
		: 10,
	PG_LOCK_TIMEOUT: process.env.PG_LOCK_TIMEOUT
		? +process.env.PG_LOCK_TIMEOUT
		: 60000,
	JSON_RPC_MAINNET: process.env.JSON_RPC_MAINNET ?? ''
}
