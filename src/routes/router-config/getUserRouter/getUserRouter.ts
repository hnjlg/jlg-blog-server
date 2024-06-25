import { Application, Request, Response } from 'express';
import { E_User_Standing } from '../../../types/standing';
import { I_User } from '../../../types/users';
import mysqlUTils from '../../../utils/mysql';
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
									title: '标签管理',
									children: [
										{
											path: '/blogBackend/TagManagement',
											componentName: 'TagManagement',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '所有标签',
											},
											name: 'TagManagement',
										},
									],
								},
								{
									title: '目录管理',
									children: [
										{
											path: '/blogBackend/CatalogManagement',
											componentName: 'CatalogManagement',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '所有目录',
											},
											name: 'CatalogManagement',
										},
										{
											path: '/blogBackend/TreeManagement',
											componentName: 'TreeManagement',
											meta: {
												keepAlive: true,
												systemPage: true,
												title: '文章树',
											},
											name: 'TreeManagement',
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
