import { assert } from 'chai'
import { API } from '../../types/api.generated'
import BaseTest from '../BaseTest'

class ConfigTests extends BaseTest {
	protected async setup() {
		it('Can get the config', () => this.getConfig())
	}

	private async getConfig() {
		const { body } = await this.makeRequest({
			path: '/api/1.0/config',
			method: API.HttpMethod.Get,
			expect: 200
		})

		assert.isOk(body.config)
		assert.isOk(body.config.version)
	}
}

describe('ConfigTests', function tests() {
	new ConfigTests(this)
})
