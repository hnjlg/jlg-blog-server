import getHistoryMsgInit from './getHistoryMsg';
import readMessage from './readMessage';
import { I_Option } from '..';

const init = ({ socket, io, jwtKey }: I_Option) => {
	getHistoryMsgInit({ socket, io, jwtKey });
	readMessage({ socket, io, jwtKey });
};

export default init;
