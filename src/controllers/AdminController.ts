import { Request, Response } from 'express'

export default class AdminController {
	public static async runMigrations(
		req: Request,
		res: Response
	): Promise<Response> {
		await orm.runMigrations()

		return res.json({
			status: 'success'
		})
	}

	public static async runSync(req: Request, res: Response): Promise<Response> {
		await orm.runSync({
			force: req.query.force === 'true'
		})

		return res.json({
			status: 'success'
		})
	}
}
