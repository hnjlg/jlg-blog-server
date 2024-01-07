import { socketOption } from '..';
import { E_User_Standing } from '../../types/standing';

export const sendNewMessage = <T = any>(userId: number, standing: E_User_Standing, msg: T) => {
	if (standing === E_User_Standing['普通用户']) {
		socketOption.socketMap.get(userId)?.emit('resNewMessage', msg);
	} else if (standing === E_User_Standing['管理员']) {
		socketOption.io?.to('admin').emit('resNewMessage', msg);
	}
};
