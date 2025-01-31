import { Server } from 'http'
import { Suite } from 'mocha'
import supertest, { SuperTest, Test, Response } from 'supertest'
import start from '../core/start'
import User from '../models/User'
import { API } from '../types/api.generated'
import { wallets, type IMocks } from './mocks'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export default class BaseTest {
	protected server!: Express.Application

	protected request!: SuperTest<Test>

	protected mocks: IMocks = {
		users: []
	}

	public constructor(mocha: Suite) {
		if (!mocha) {
			throw new Error('Test suite is not passing mocha to base constructor')
		}
		// Set mocha options for timeout to 30s and no retries
		mocha.timeout(30000)
		mocha.retries(0)

		before(() => this.before())
		after(() => this.after())
		beforeEach(() => this.beforeEach())
		afterEach(() => this.afterEach())
		this.setup()
	}

	protected async before() {
		const { server } = await start()
		this.server = server as Server
		this.request = supertest(this.server)
		await orm.runSync()

		await this.setupMocks()
	}

	protected async setupMocks() {
		for (let i = 0; i < wallets.length; i++) {
			const w = wallets[i]
			const wallet = await orm.models.Wallet.create({
				address: w.address
			})
			const user = await services.meemId.createOrUpdateUser({
				wallet
			})

			this.mocks.users.push(user)
		}
	}

	protected async after() {}

	protected async setup() {
		log.warn('No tests run because there is no setup() method')
	}

	protected beforeEach() {}

	protected afterEach() {}

	protected async makeRequest(options: {
		path: string
		method: API.HttpMethod
		query?: Record<string, any>
		// eslint-disable-next-line @typescript-eslint/ban-types
		data?: string | object
		expect?: number
		user?: User
		headers?: Record<string, any>
	}): Promise<Response> {
		const { path, method, data, query, expect, user, headers } = options
		let req = this.getRequest(method)(path)

		if (query) {
			req = req.query(query)
		}

		if (headers) {
			Object.keys(headers).forEach(key => req.set(key, headers[key]))
		}

		if (user) {
			const jwt = services.meemId.generateJWT({
				walletAddress: user.DefaultWallet.address
			})
			req = req.set('Authorization', `JWT ${jwt}`)
		}

		if (data) {
			req = req.send(data)
		}

		if (typeof expect === 'number') {
			req = req.expect(expect)
		}

		const result = await req

		return result
	}

	protected wait(ms: number) {
		return new Promise(resolve => {
			setTimeout(() => resolve(null), ms)
		})
	}

	protected getRequest(method: API.HttpMethod) {
		switch (method) {
			case API.HttpMethod.Options:
				return this.request.options
			case API.HttpMethod.Delete:
				return this.request.delete
			case API.HttpMethod.Patch:
				return this.request.patch
			case API.HttpMethod.Post:
				return this.request.post
			case API.HttpMethod.Get:
			default:
				return this.request.get
		}
	}

	protected setSigner(signer: any) {
		// @ts-ignore
		// eslint-disable-next-line prefer-destructuring
		global.signer = signer
	}
}
