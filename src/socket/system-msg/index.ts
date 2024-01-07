import getHistoryMsgInit from './getHistoryMsg';
import readMessage from './readMessage';
import { I_Option } from '..';

const init = ({ socket, io }: I_Option) => {
	getHistoryMsgInit({ socket, io });
	readMessage({ socket, io });
};

export default init;
