import { I_Option } from '..';

const init = ({ socket }: I_Option) => {
	socket.on('reqReadMessage', (data: { id: number }) => {
		if (!data || !data.id) {
			socket.emit('resReadMessage', {
				message: '消息已读失败,没有对应的消息id',
			});
		} else {
			socket.emit('resReadMessage', {
				message: '消息已读成功id:' + data.id,
			});
		}
	});
};

export default init;
