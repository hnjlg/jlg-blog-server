import { Application, Request, Response } from 'express';

export default ({ app }: { app: Application }) => {
	app.get('/sentry-sdk/add-error', [], (req: Request, res: Response) => {
		return res.status(200).json({
			status: 1,
			message: 'success',
			content: [],
		});
	});
};
