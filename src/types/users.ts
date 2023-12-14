import { E_User_Standing } from './standing';

export declare type T_Users = I_User[];

export declare interface I_User {
	id: number;
	user_name: string;
	pass_word: string;
	user_code: string;
	standing: E_User_Standing;
}
