import { Application, Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';
import { T_SelectList } from '../../types/selectList';

export default ({ app }: { app: Application }) => {
	app.post('/blog-backstage/article-status/all/query', [], (req: Request, res: Response) => {
		mysqlUTils.query<[], T_SelectList>('SELECT status_name AS label, status_value AS value FROM article_status;', [], function (results) {
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
 * /blog-backstage/article-status/all/query:
 *   post:
 *     tags: ['blog-backstage']
 *     summary: 文章状态列表
 *     description: |
 *       查询文章状态列表
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
 *                     $ref: '#/components/schemas/SelectListItem'
 */
