import { Application } from 'express';
import http from 'http';
import webSocket, { Server, Socket } from 'socket.io';
import systemMsgSocket from './system-msg/index';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import jwt from 'jsonwebtoken';
import mysqlUTils from '../utils/mysql';
import { E_User_Standing } from '../types/standing';

export declare interface I_Option {
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
	io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
}

export const socketOption: {
	socketMap: Map<number, I_Option['socket']>;
	io: webSocket.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null;
} = {
	socketMap: new Map(),
	io: null,
};

const init = ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	const server = http.createServer(app);

	const io = new webSocket.Server(server);

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
				} else {
					socket.disconnect(true);
					return;
				}
			});
		});

		systemMsgSocket({ socket, io });
	});

	return server;
};

export default init;
