import { Application, Request, Response } from 'express';
import { E_User_Standing } from '../../types/standing';
import { I_User } from '../../types/users';
import mysqlUTils from '../../utils/mysql';
import jwt from 'jsonwebtoken';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	app.get('/router-config/user/router/query', [], (req: Request, res: Response) => {
		const token = req.headers['authorization'];
		if (token) {
			jwt.verify(token, jwtKey, (err, user: any) => {
				mysqlUTils.query<[number], [I_User]>(`SELECT * FROM users WHERE id = ?`, [user.id], function (findUser) {
					if (findUser[0].standing === E_User_Standing['管理员']) {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: [
								{
									title: '文章管理',
									children: [
										{
											path: '/blogBackend/BlogArticleAll',
											componentName: 'BlogArticleAll',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '全部文章',
											},
											name: 'BlogArticleAll',
										},
										{
											path: '/blogBackend/BlogArticleAllMe',
											componentName: 'BlogArticleAllMe',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '我的文章',
											},
											name: 'BlogArticleAllMe',
										},
									],
								},
								{
									title: '用户管理',
									children: [
										{
											path: '/blogBackend/UserManagement',
											componentName: 'UserManagement',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '所有用户',
											},
											name: 'UserManagement',
										},
									],
								},
								{
									title: '其他',
									children: [],
								},
							],
						});
					} else {
						return res.status(200).json({
							status: 1,
							message: 'success',
							content: [
								{
									title: '文章管理',
									children: [
										{
											path: '/blogBackend/BlogArticleAllMe',
											componentName: 'BlogArticleAllMe',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '我的文章',
											},
											name: 'BlogArticleAllMe',
										},
									],
								},
							],
						});
					}
				});
			});
		}
	});
};

/**
 * @swagger
 * /router-config/user/router/query:
 *   get:
 *     tags: ['router-config']
 *     summary: 获取登录用户页面权限
 *     description: |
 *       获取登录用户页面权限，做前端动态路由
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
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                          children:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/RouterConfigUserRouterQueryResponse'
 */
