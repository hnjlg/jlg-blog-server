import { E_User_Standing } from './standing';

export declare interface I_Jwt {
	app_key: string;
	id: number;
	userName: string;
	standing: E_User_Standing;
}
