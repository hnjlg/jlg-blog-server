import { Application } from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import mysqlUTils from '../../utils/mysql';

export default ({ app }: { app: Application }) => {
	app.post(
		'/user/update',
		[
			body('author').notEmpty().withMessage('author cannot be empty').isInt().withMessage('author must be number'),
			body('passWord')
				.notEmpty()
				.withMessage('passWord cannot be empty')
				.isLength({ min: 5, max: 32 })
				.withMessage('passWord length must between 5 and 32'),
		],
		(req: Request, res: Response) => {
			const { author, passWord } = req.body;

			mysqlUTils.query<
				[number],
				[
					{
						count: number;
					},
				]
			>('SELECT COUNT(*) as count FROM users WHERE id = ?;', [Number(author)], function (results) {
				if (results && results[0].count > 0) {
					mysqlUTils.query<[string, number], []>(`UPDATE users SET pass_word = ? where id = ?;`, [passWord, Number(author)], function (results) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: results,
						});
					});
				} else {
					return res.status(401).json({
						status: 1,
						message: 'failed',
						content: results,
					});
				}
			});
		}
	);
};

/**
 * @swagger
 * /user/update:
 *   post:
 *     tags: ['user']
 *     summary: 修改账户资料
 *     description: |
 *       修改账户资料
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: integer
 *                 description: 用户id
 *               passWord:
 *                 type: string
 *                 description: 加密密码
 *             example:
 *               author: 1
 *               passWord: "20f645c703944a0027acf6fad92ec465247842450605c5406b50676ff0dcd5ea"
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
 *                       fieldCount:
 *                         type: integer
 *                         description: 描述
 *                       affectedRows:
 *                         type: integer
 *                         description: 描述
 *                       insertId:
 *                         type: integer
 *                         description: 描述
 *                       info:
 *                         type: string
 *                         description: 描述
 *                       serverStatus:
 *                         type: integer
 *                         description: 描述
 *                       warningStatus:
 *                         type: integer
 *                         description: 描述
 *                       changedRows:
 *                         type: integer
 *                         description: 描述
 */
