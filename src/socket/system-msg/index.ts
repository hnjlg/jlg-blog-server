import getHistoryMsgInit from './getHistoryMsg';
import readMessage from './readMessage';
import { I_Option } from '..';

const init = ({ socket, io, jwtKey, redisClient }: I_Option) => {
	getHistoryMsgInit({ socket, io, jwtKey, redisClient });
	readMessage({ socket, io, jwtKey, redisClient });
};

export default init;
