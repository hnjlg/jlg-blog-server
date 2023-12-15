import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { E_Article_Status } from '../../types/articleStatus';

interface I_Blog_Article {
	id: number;
	title: string;
	content: string;
	reading_quantity: number;
	add_time: string;
	status_name: string;
	status_value: number;
	tags: string;
	author: number;
	standing: number;
}

enum E_User_Standing {
	'普通用户' = 1,
	'管理员',
}

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.post(
		'/blog-backstage/article/query/for/articleId',
		[body('articleId').notEmpty().withMessage('articleId cannot be empty').isInt().withMessage('articleId must be a number')],
		(req: Request, res: Response) => {
			const result = validationResult(req);

			if (!result.isEmpty()) {
				return res.status(400).json({
					status: 2,
					message: 'failed',
					content: result.array(),
				});
			}

			const { articleId } = req.body;
			mysqlUTils.query<[number], I_Blog_Article[]>(
				`SELECT blog_article.id, blog_article.title, blog_article.content, blog_article.content_html, 
				blog_article.reading_quantity, blog_article.author, blog_article.add_time, blog_article.article_tree_id,
				article_status.status_name, article_status.status_value, GROUP_CONCAT(article_tags.tag_name) AS tags, 
				users.standing, users.user_name AS author_name, article_tree.article_tree_name FROM blog_article 
                JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
                JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
                LEFT JOIN article_status ON blog_article.status = article_status.status_value
				LEFT JOIN users ON blog_article.author = users.id
				LEFT JOIN article_tree ON article_tree.id = blog_article.article_tree_id
                WHERE blog_article.valid = 1 AND blog_article.id = ? 
                GROUP BY blog_article.id, blog_article.title, blog_article.content, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value;`,
				[Number(articleId)],
				function (results) {
					const authHeader = req.headers['authorization'];
					const token = authHeader && authHeader.split(' ')[1];
					if (results[0] && token) {
						if (results[0].standing === E_User_Standing['普通用户']) {
							jwt.verify(token, jwtKey, (err, user: any) => {
								if (user.id !== results[0].author) {
									return res.status(401).json({
										status: 2,
										message: 'failed',
										content: '当前用户不支持查看该未公开的文章',
									});
								} else {
									return res.status(200).json({
										status: 1,
										message: 'success',
										content: results[0],
									});
								}
							});
						} else if (results[0].standing === E_User_Standing['管理员']) {
							if ([E_Article_Status['待审'], E_Article_Status['公开'], E_Article_Status['驳回']].includes(results[0].status_value)) {
								return res.status(200).json({
									status: 1,
									message: 'success',
									content: results[0],
								});
							} else {
								return res.status(401).json({
									status: 2,
									message: 'failed',
									content: '管理员不支持查看该草稿，私有的文章',
								});
							}
						}
					} else {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results[0],
						});
					}
				}
			);
		}
	);
};

/**
 * @swagger
 * /blog-backstage/article/query/for/articleId:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 获取文章详情通过文章id
 *     description: |
 *       获取文章详情
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlogBackstageArticleQueryForArticleRequest'
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
 *                   $ref: '#/components/schemas/BlogBackstageArticleQueryForArticleResponse'
 */
