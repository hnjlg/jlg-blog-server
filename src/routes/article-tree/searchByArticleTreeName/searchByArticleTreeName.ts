import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { T_Article_Tree } from '../../../types/articleTree';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/article-tree-name/query',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
			body('articleTreeName').notEmpty().withMessage('articleTreeName cannot be empty'),
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
			const { pageSize, pageIndex, articleTreeName } = req.body;

			mysqlUTils.query<[string, number, number] | [number, number], T_Article_Tree>(
				`SELECT id, article_tree_name, parent_article_tree_id from article_tree ${
					articleTreeName !== undefined ? 'WHERE article_tree_name LIKE ?' : ''
				} LIMIT ? OFFSET ?;`,
				[`%${articleTreeName}%`, Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
				function (results) {
					mysqlUTils.query<[string] | [], [{ total: number }]>(
						`SELECT COUNT(*) AS total from article_tree ${articleTreeName !== undefined ? 'WHERE article_tree_name LIKE ?' : ''};`,
						[`%${articleTreeName}%`],
						function (resultsTotal) {
							return res.status(200).json({
								status: 1,
								message: 'success',
								content: {
									arr: results.map((item) => {
										if (item.parent_article_tree_id === null) {
											item.parent_article_tree_id = 0;
										}
										return item;
									}),
									total: resultsTotal[0].total,
								},
							});
						}
					);
				}
			);
		}
	);
};
