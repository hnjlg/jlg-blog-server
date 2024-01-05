import { I_Option } from '..';

const option: Partial<I_Option> = {};

const init = ({ socket, io }: I_Option) => {
	option.socket = socket;
	option.io = io;
};

let i = 3;

export const sendNewMessage = () => {
	// option.io?.to('admin').emit('resNewMessage', { test: '管理员房间测试' });
	option.socket?.emit('resNewMessage', {
		id: i++,
		title: 'title' + i,
		content: 'content' + i,
		sendTime: '2022-01-01 00:00:00',
		isRead: false,
	});
};

setInterval(() => {
	sendNewMessage();
}, 3000);

export default init;
