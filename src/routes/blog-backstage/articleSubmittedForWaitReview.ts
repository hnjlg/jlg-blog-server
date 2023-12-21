import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog-backstage/article/add',
		[
			body('title').notEmpty().withMessage('标题title不能为空'),
			body('content').notEmpty().withMessage('文章内容content不能为空'),
			body('content_html').notEmpty().withMessage('文章内容content_html不能为空'),
			body('author').notEmpty().withMessage('作者author不能为空').isInt().withMessage('author must be a number'),
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
			const { title, content, content_html, author, article_tree_id, articleTags } = req.body;
			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) as count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<
						[number],
						[
							{
								count: number;
							},
						]
					>('SELECT COUNT(*) as count FROM article_tree WHERE id = ?;', [Number(article_tree_id)], function (results) {
						if (results && results[0].count > 0) {
							mysqlUTils.query<[number[]], []>(`SELECT * FROM article_tags WHERE id IN (?)`, [articleTags], function (results) {
								if (results && results.length === articleTags.length) {
									mysqlUTils.query<[string, string, string, number, number, number], { insertId: number }>(
										`INSERT blog_article(title,content,content_html,status,author,article_tree_id) VALUES (?,?,?,?,?,?);`,
										[title, content, content_html, 1, Number(author), Number(article_tree_id)],
										function (results) {
											if (results && results.insertId) {
												mysqlUTils.query<[], []>(
													`INSERT INTO article_tag_connection(article_id,tag_id) values ${articleTags.map((item: number) => {
														return `(${results.insertId},${item})`;
													})}`,
													[],
													function () {
														return res.status(200).json({
															status: 1,
															message: 'success',
															content: results,
														});
													}
												);
											}
										}
									);
								}
							});
						} else {
							return res.status(401).json({
								status: 1,
								message: '文章树id不存在',
								content: results,
							});
						}
					});
				} else {
					return res.status(401).json({
						status: 1,
						message: '用户id不存在',
						content: results,
					});
				}
			});
		}
	);
};

/**
 * @swagger
 * /blog-backstage/article/add:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 新增博客文章
 *     description: |
 *       新增一篇待审的文章
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleAddRequest'
 *     responses:
 *       '200':
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   description: 1表示成功，2表示失败
 *                 message:
 *                   type: string
 *                   description: success表示成功，failed表示失败
 *                 content:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MySQLResult'
 */
