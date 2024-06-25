import { Application, Request, Response } from 'express';
import mysqlUTils from '../../../utils/mysql';
import { body, validationResult } from 'express-validator';
import { E_Article_Status } from '../../../types/articleStatus';
import { I_MySQLResult } from '../../../types/mysqlResult';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog-backstage/article/edit',
		[
			body('articleId').notEmpty().withMessage('文章id articleId不能为空').isInt().withMessage('articleId must be a number'),
			body('title').notEmpty().withMessage('标题title不能为空'),
			body('content').notEmpty().withMessage('文章内容content不能为空'),
			body('content_html').notEmpty().withMessage('文章内容content_html不能为空'),
			body('article_tree_id').notEmpty().withMessage('文章树article_tree_id不能为空').isInt().withMessage('article_tree_id must be a number'),
			body('articleTags').custom((value) => {
				if (!Array.isArray(value)) {
					throw new Error('Value must be an array');
				}
				for (let i = 0; i < value.length; i++) {
					if (typeof value[i] !== 'number' && !Number.isInteger(value[i])) {
						throw new Error('Array values must be numbers');
					}
				}
				return true;
			}),
		],
		(req: Request, res: Response) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ status: 2, message: 'failed', content: errors.array() });
			}
			const { title, content, content_html, article_tree_id, articleTags, articleId } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) AS count FROM article_tree WHERE id = ?;', [Number(article_tree_id)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[number[]], []>(`SELECT * FROM article_tags WHERE id IN (?)`, [articleTags], function (results) {
						if (results && results.length === articleTags.length) {
							mysqlUTils.query<
								[number],
								[
									{
										status: E_Article_Status;
									},
								]
							>(`SELECT status FROM blog_article WHERE id = ?`, [articleId], function (article) {
								if (article && article.length > 0) {
									// 根据用户和之前的文章状态去更新文章状态
									if (article[0].status === E_Article_Status['待审']) {
										return res.status(401).json({
											status: 2,
											message: '待审的文章不支持编辑',
											content: null,
										});
									}
									// 如果是公开或者驳回的文章，则将状态改为待审
									// 更新文章内容
									mysqlUTils.query<[string, string, string, number, number, E_Article_Status], I_MySQLResult>(
										`UPDATE blog_article SET title = ?, content = ?, content_html = ?, article_tree_id = ?, status = ? where id = ?;`,
										[
											title,
											content,
											content_html,
											article_tree_id,
											[E_Article_Status['公开'], E_Article_Status['驳回']].includes(article[0].status) ? E_Article_Status['待审'] : article[0].status,
											articleId,
										],
										function (result) {
											// 更新文章标签关联表
											mysqlUTils.query<[number], I_MySQLResult>(`DELETE FROM article_tag_connection WHERE article_id = ?`, [articleId], function () {
												articleTags.forEach((tagId: number) => {
													mysqlUTils.query<[number, number], I_MySQLResult>(
														`
                                            INSERT INTO article_tag_connection (article_id, tag_id)
                                                VALUES
                                                    (?, ?);
                                            `,
														[articleId, tagId],
														function () {
															return res.status(200).json({
																status: 1,
																message: 'success',
																content: result,
															});
														}
													);
												});
											});
										}
									);
								} else {
									return res.status(401).json({
										status: 2,
										message: `文章id:${articleId}的文章不存在`,
										content: null,
									});
								}
							});
						} else {
							return res.status(401).json({
								status: 2,
								message: '文章标签article_tags存在未定义的标签',
								content: null,
							});
						}
					});
				} else {
					return res.status(401).json({
						status: 2,
						message: `文章树id:${article_tree_id}不存在`,
						content: null,
					});
				}
			});
		}
	);
};
