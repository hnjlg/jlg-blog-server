import { Application, Request, Response } from 'express';
import { body } from 'express-validator';
import mysqlUTils from '../../../utils/mysql';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/delete',
		[body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be number')],
		(req: Request, res: Response) => {
			const { author } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[number], I_MySQLResult>(`UPDATE users SET valid = 0 WHERE id = ?;`, [Number(author)], function (results) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results,
						});
					});
				} else {
					return res.status(401).json({
						status: 1,
						message: '用户不存在',
						content: results,
					});
				}
			});
		}
	);
};
