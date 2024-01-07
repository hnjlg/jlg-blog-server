import { socketSet } from '..';

let i = 0;

export const sendNewMessage = (userId: number) => {
	console.log(userId, 'userId', socketSet.get(userId));
	// option.io?.to('admin').emit('resNewMessage', { test: '管理员房间测试' });
	socketSet.get(userId)?.emit('resNewMessage', {
		id: i++,
		title: 'title' + i,
		content: 'content' + i,
		sendTime: '2022-01-01 00:00:00',
		isRead: false,
	});
};
