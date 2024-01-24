import { I_Option } from '..';
import jwt from 'jsonwebtoken';
import mysqlUtils from '../../utils/mysql';

const init = ({ socket, jwtKey }: I_Option) => {
	socket.on('reqHistoryMsg', () => {
		const token = socket.handshake.query.Authorization;
		if (token) {
			jwt.verify(token as string, jwtKey, (err, user: any) => {
				mysqlUtils.query(`SELECT * FROM system_msg WHERE receiver = ?`, [user.id], (msgs) => {
					socket.emit('resHistoryMsg', msgs);
				});
			});
		}
	});
};

export default init;
