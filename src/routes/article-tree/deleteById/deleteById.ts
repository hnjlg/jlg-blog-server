import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/article-tree/byId/delete',
		[body('article_tree_id').notEmpty().withMessage('article_tree_id cannot be empty').isInt().withMessage('article_tree_id must be number')],
		(req: Request, res: Response) => {
			const { article_tree_id } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM blog_article WHERE article_tree_id = ?;', [Number(article_tree_id)], function (results) {
				// 如果该级文章树下还有文章不让删除
				if (results && results[0].count > 0) {
					return res.status(401).json({
						status: 1,
						message: '文章目录下有还有文章，不允许删除',
						content: results,
					});
				} else {
					mysqlUTils.query<
						[number],
						[
							{
								count: number;
							},
						]
					>('SELECT COUNT(*) AS count FROM article_tree WHERE parent_article_tree_id = ?;', [Number(article_tree_id)], function (results) {
						// 如果该级文章树下还有文章树不让删除
						if (results && results[0].count > 0) {
							return res.status(401).json({
								status: 2,
								message: '文章目录下有还有文章，不允许删除',
								content: results,
							});
						} else {
							mysqlUTils.query<
								[number],
								[
									{
										count: number;
									},
								]
							>(`SELECT COUNT(*) AS count FROM article_tree_tag WHERE article_tree_id = ?;`, [Number(article_tree_id)], function (results) {
								if (results && results[0].count > 0) {
									mysqlUTils.query<[number], []>(`DELETE FROM article_tree where id = ?;`, [Number(article_tree_id)], function (results) {
										return res.status(200).json({
											status: 1,
											message: 'success',
											content: results,
										});
									});
								} else {
									return res.status(401).json({
										status: 2,
										message: '未找到对应的文章目录',
										content: null,
									});
								}
							});
						}
					});
				}
			});
		}
	);
};
