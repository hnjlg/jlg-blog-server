import { Application, Request, Response } from 'express';
import { body, validationResult, check } from 'express-validator';
import mysqlUTils from '../../../utils/mysql';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog-backstage/article/batchUpdate',
		[
			body('tag_id').notEmpty().withMessage('tag_id cannot be empty').isInt().withMessage('tag_id must be number'),
			body('article_ids').notEmpty().withMessage('article_ids cannot be empty').isArray().withMessage('article_ids must be array'),
			check('article_ids.*').isNumeric().withMessage('数组元素必须是数字'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					content: result.array(),
				});
			}
			const { article_ids, tag_id } = req.body;

			mysqlUTils.query<[string], [I_MySQLResult]>(
				'INSERT INTO article_tag_connection (article_id, tag_id) VALUES ?;',
				[article_ids.map((item: number) => [item, tag_id])],
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
