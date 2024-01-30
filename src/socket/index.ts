import { Application } from 'express';
import http from 'http';
import webSocket, { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import jwt from 'jsonwebtoken';
import mysqlUTils from '../utils/mysql';
import { E_User_Standing } from '../types/standing';
import { T_RedisClient } from '../global';
import systemMsgSocket from './system-msg/index';
import connectionMsgSocket from './connection-msg/index';

export declare interface I_Option {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	redisClient: T_RedisClient;
	jwtKey: string;
}

export const socketOption: {
	socketMap: Map<number, I_Option['socket']>;
	io: webSocket.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
} = {
	socketMap: new Map(),
	io: null,
};

const init = ({ app, jwtKey, redisClient }: { app: Application; jwtKey: string; redisClient: T_RedisClient }) => {
	// redisClient.set('user:a', 1);
	// console.log(redisClient.get('user:a'));
	// redisClient.keys('user:*', (err, keys) => {
	// 	if (err) {
	// 		console.error('获取在线用户列表出错:', err);
	// 		return;
	// 	}
	// 	console.log(keys, 'keys');
	// });
	// redisClient.set(`user:${userInfo.id}`, userInfo);
	// client.keys('user:*', (err, keys) => {
	// 	if (err) {
	// 		console.error('获取在线用户列表出错:', err);
	// 		return;
	// 	}

	// 	const onlineUsers = keys.map((key) => key.split(':')[1]);
	// 	console.log('当前在线用户:', onlineUsers);
	// });
	// client.del(`user:${userId}`);

	const server = http.createServer(app);

	const io = new webSocket.Server(server);

	socketOption.io = io;

	io.on('connection', (socket: I_Option['socket']) => {
		const token = socket.handshake.query.Authorization;
		if (!token || typeof token !== 'string') {
			socket.disconnect(true);
			return;
		}
		jwt.verify(token, jwtKey, (err, user: any) => {
			if (!user || !user.id) {
				socket.disconnect(true);
				return;
			}
			mysqlUTils.query<
				[number],
				[
					{
						standing: E_User_Standing;
					},
				]
			>(`SELECT standing FROM users WHERE id = ?`, [user.id], function (result) {
				if (result && result.length === 1) {
					/* 
						如果是管理员，则加入socket为管理员的集合
						如果是普通用户，则单独创建推送
					*/

					if (result[0].standing === E_User_Standing['管理员']) {
						socket.join('admin');
					}

					socketOption.socketMap.set(user.id, socket);

					socket.on('reqLoginout', () => {
						socket.disconnect(true);
						socketOption.socketMap.delete(user.id);
						if (result[0].standing === E_User_Standing['管理员']) {
							socket.leave('admin');
						}
					});
				} else {
					socket.disconnect(true);
					return;
				}
			});
		});

		systemMsgSocket({ socket, io, jwtKey, redisClient });

		connectionMsgSocket({ socket, io, jwtKey, redisClient });

		// setInterval(() => {
		// 	socket.emit('resRouterChange', [
		// 		{
		// 			path: '/blogBackend/BlogArticleAll',
		// 			componentName: 'BlogArticleAll',
		// 			meta: {
		// 				keepAlive: true,
		// 				systemPage: true,
		// 				title: '博客后台全部文章页aaaaaa',
		// 			},
		// 			name: 'BlogArticleAll',
		// 		},
		// 		{
		// 			path: '/blogBackend/BlogArticleAllMe',
		// 			componentName: 'BlogArticleAllMe',
		// 			meta: {
		// 				keepAlive: true,
		// 				systemPage: true,
		// 				title: '我的文章aaaa',
		// 			},
		// 			name: 'BlogArticleAllMe',
		// 		},
		// 	]);
		// }, 3000);
	});

	return server;
};

export default init;
