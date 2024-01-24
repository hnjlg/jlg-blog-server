import dayjs from 'dayjs';
import { I_Option } from '..';
import mysqlUtils from '../../utils/mysql';
import { E_Msg_Is_Read } from '../../types/msg_is_read';

const init = ({ socket }: I_Option) => {
	socket.on('reqReadMessage', (data: { id: number }) => {
		if (!data || !data.id) {
			socket.emit('resReadMessage', {
				message: '消息已读失败,没有对应的消息id',
			});
		} else {
			mysqlUtils.query(
				`UPDATE system_msg SET is_read = ?, read_time = ? WHERE id = ?`,
				[E_Msg_Is_Read.是, dayjs().format('YYYY/MM/DD hh:mm:ss'), data.id],
				function () {
					socket.emit('resReadMessage', {
						message: '消息已读成功',
					});
				}
			);
		}
	});
};

export default init;
