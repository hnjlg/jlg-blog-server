import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { body, validationResult } from 'express-validator';

export default ({ app }: { app: Application }) => {
	app.post(
		'/blog-backstage/article/query/for/author',
		[
			body('pageSize').notEmpty().withMessage('pageSize cannot be empty').isInt().withMessage('pageSize must be a number'),
			body('pageIndex').notEmpty().withMessage('pageIndex cannot be empty').isInt().withMessage('pageIndex must be a number'),
			body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be a number'),
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

			const { pageSize, pageIndex, author } = req.body;
			mysqlUTils.query<[number, number, number], []>(
				`SELECT blog_article.id, blog_article.title, blog_article.content, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value, GROUP_CONCAT(article_tags.tag_name) AS tags 
                FROM blog_article 
                JOIN article_tag_connection ON blog_article.id = article_tag_connection.article_id 
                JOIN article_tags ON article_tag_connection.tag_id = article_tags.id 
                LEFT JOIN article_status ON blog_article.status = article_status.status_value 
                WHERE blog_article.valid = 1 AND blog_article.author = ? 
                GROUP BY blog_article.id, blog_article.title, blog_article.content, blog_article.reading_quantity, blog_article.add_time, article_status.status_name, article_status.status_value 
                LIMIT ? OFFSET ?;`,
				[Number(author), Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
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

/**
 * @swagger
 * /blog-backstage/article/query/for/author:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 获取文章列表通过作者id
 *     description: |
 *       获取文章，并可根据参数分页查询。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageIndex:
 *                 type: integer
 *                 description: 要获取的页数
 *               pageSize:
 *                 type: integer
 *                 description: 每页显示的文章数量
 *               author:
 *                 type: integer
 *                 description: 作者id
 *             example:
 *               pageIndex: 1
 *               pageSize: 10
 *               author: 1
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: 文章id
 *                       title:
 *                         type: string
 *                         description: 文章标题
 *                       content:
 *                         type: string
 *                         description: 文章内容
 *                       reading_quantity:
 *                         type: integer
 *                         description: 文章阅读量
 *                       add_time:
 *                         type: string
 *                         format: date-time
 *                         description: 文章发布时间
 *                       tags:
 *                         type: string
 *                         description: 文章标签
 */
