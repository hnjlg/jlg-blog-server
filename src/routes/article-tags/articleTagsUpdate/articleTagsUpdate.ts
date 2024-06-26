import { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mysqlUTils from '../../../utils/mysql';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tags/tags/update',
		[
			body('tag_id').notEmpty().withMessage('tag_id cannot be empty').isInt().withMessage('tag_id must be number'),
			body('tag_name').notEmpty().withMessage('tag_name cannot be empty').isString().withMessage('tag_name must be string'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { tag_name, tag_id } = req.body;

			mysqlUTils.query<[string, number], [I_MySQLResult]>(
				'UPDATE article_tags SET tag_name = ? WHERE id = ?;',
				[String(tag_name), Number(tag_id)],
				function (results) {
					return res.status(200).json({
						status: 1,
						message: 'success',
						content: results,
					});
				}
			);
		}
	);
};
