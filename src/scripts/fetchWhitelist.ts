/* eslint-disable no-console */
import path from 'path'
import fs from 'fs-extra'
import request from 'superagent'

async function downloadMeemABI() {
	const { text } = await request.get(
		'https://raw.githubusercontent.com/meemproject/meem-registry/master/meem-whitelist.json'
	)

	await fs.ensureDir(path.join(process.cwd(), 'src', 'lib'))
	await fs.writeFile(
		path.join(process.cwd(), 'src', 'lib', 'meem-whitelist.json'),
		text
	)

	const { text: testingText } = await request.get(
		'https://raw.githubusercontent.com/meemproject/meem-registry/master/meem-whitelist-testing.json'
	)

	await fs.ensureDir(path.join(process.cwd(), 'src', 'lib'))
	await fs.writeFile(
		path.join(process.cwd(), 'src', 'lib', 'meem-whitelist-testing.json'),
		testingText
	)
}

downloadMeemABI()
	.then(() => {
		console.log(`Meem Whitelist downloaded`)
	})
	.catch(e => {
		console.log(e)
	})
