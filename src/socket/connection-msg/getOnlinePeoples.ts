import { I_Option } from '..';

const init = ({ redisClient, socket }: I_Option) => {
	socket.on('reqOnlinePeoples', () => {
		redisClient.keys('user:*').then((keyArr: string[]) => {
			Promise.all(keyArr.map((item) => redisClient.get(item))).then((users) => {
				socket.emit('resOnlinePeoples', users);
			});
		});
	});
};

export default init;
