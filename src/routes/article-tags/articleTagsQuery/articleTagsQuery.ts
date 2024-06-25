import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tags/tags/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
		],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			const { pageSize, pageIndex, tagName } = req.body;
			mysqlUTils.query<[string, number, number] | [number, number], []>(
				`SELECT id, tag_name FROM article_tags WHERE valid = 1 ${!tagName ? 'AND tag_name LIKE ?' : ''} LIMIT ? OFFSET ?;`,
				tagName !== undefined ? [`%${tagName}%`, pageSize, (pageIndex - 1) * pageSize] : [pageSize, (pageIndex - 1) * pageSize],
				function (results) {
					mysqlUTils.query<[string] | [], [{ total: number }]>(
						`SELECT COUNT(*) AS total FROM article_tags WHERE ${!tagName ? 'tag_name LIKE ?' : ''} AND valid = 1;`,
						tagName !== undefined ? [`%${tagName}%`] : [],
						function (resultTotal) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: { arr: results, total: resultTotal[0].total },
							});
						}
					);
				}
			);
		}
	);
};
