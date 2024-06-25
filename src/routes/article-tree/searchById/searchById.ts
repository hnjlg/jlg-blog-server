import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { T_Article_Tree } from '../../../types/articleTree';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/article-tree-id/query',
		[
			body('articleTreeId')
				.notEmpty()
				.withMessage('articleTreeId cannot be empty')
				.custom((value) => {
					if (value === null) return true;
					return !isNaN(value);
				})
				.withMessage('articleTreeId must be a number or null'),
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
			const { articleTreeId } = req.body;

			mysqlUTils.query<[number], T_Article_Tree>(
				`SELECT id, article_tree_name, parent_article_tree_id from article_tree WHERE parent_article_tree_id = ?;`,
				[articleTreeId],
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
