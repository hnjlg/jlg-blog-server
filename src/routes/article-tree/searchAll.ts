import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post('/article-tree/all/query', [], (req: Request, res: Response) => {
		mysqlUTils.query<[], []>(`SELECT id, article_tree_name, parent_article_tree_id from article_tree;`, [], function (results) {
			return res.status(200).json({
				status: 1,
				message: 'success',
				content: results,
			});
		});
	});
};

/**
 * @swagger
 * /article-tree/all/query:
 *   post:
 *     tags: ['article-tree']
 *     summary: 获取文章树
 *     description: |
 *       获取文章树
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
 *                     $ref: '#/components/schemas/ArticleTreeTable'
 */
