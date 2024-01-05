import { I_Option } from '..';

const init = ({ socket }: I_Option) => {
	socket.on('reqHistoryMsg', () => {
		socket.emit('resHistoryMsg', [
			{
				id: 1,
				title: 'title',
				content: 'content',
				sendTime: '2022-01-01 00:00:00',
				isRead: true,
			},
			{
				id: 2,
				title: 'title2',
				content: 'content2',
				sendTime: '2022-01-01 00:00:00',
				isRead: false,
			},
		]);
	});
};

export default init;
