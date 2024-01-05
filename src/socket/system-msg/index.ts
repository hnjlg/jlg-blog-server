import getHistoryMsgInit from './getHistoryMsg';
import sendNewMessage from './sendNewMessage';
import readMessage from './readMessage';
import { I_Option } from '..';

const init = ({ socket, io }: I_Option) => {
	getHistoryMsgInit({ socket, io });
	sendNewMessage({ socket, io });
	readMessage({ socket, io });
};

export default init;
