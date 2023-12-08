import { Application, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/all/query',
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

			const { pageSize, pageIndex } = req.body;
			mysqlUTils.query<[number, number], []>(
				`SELECT users.id, users.user_name, users.pass_word, users.user_code, user_standing.id as user_standing_id, user_standing.standing_name, user_standing.standing_value FROM users
				LEFT JOIN user_standing ON users.standing = user_standing.standing_value 
				WHERE users.valid = 1
				GROUP BY users.id 
				LIMIT ? OFFSET ?;`,
				[Number(pageSize), (Number(pageIndex) - 1) * Number(pageSize)],
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
 * /user/all/query:
 *   post:
 *     tags: ['user']
 *     summary: 查询用户列表
 *     description: |
 *       查询用户列表，支持分页查询
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
 *             example:
 *               pageIndex: 1
 *               pageSize: 10
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
 *                         description: 用户id
 *                       user_name:
 *                         type: string
 *                         description: 用户名
 *                       pass_word:
 *                         type: string
 *                         description: 用户密码
 *                       user_code:
 *                         type: string
 *                         description: 用户code
 *                       user_standing_id:
 *                         type: integer
 *                         description: 用户类型id
 *                       standing_name:
 *                         type: string
 *                         description: 用户类型名称
 *                       standing_value:
 *                         type: integer
 *                         description: 用户类型值
 */