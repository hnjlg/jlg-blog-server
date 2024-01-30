import { I_Option } from '..';
import getOnlinePeoples from './getOnlinePeoples';

const init = ({ socket, io, redisClient, jwtKey }: I_Option) => {
	getOnlinePeoples({
		socket,
		redisClient,
		io,
		jwtKey,
	});
};

export default init;
