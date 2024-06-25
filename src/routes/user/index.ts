import { Application } from 'express';
import login from './login/login';
import register from './register/register';
import update from './update/update';
import deleteRoute from './delete/delete';
import queryAll from './queryAll/queryAll';
import { T_RedisClient } from '../../global';

export default ({ app, jwtKey, redisClient }: { app: Application; jwtKey: string; redisClient: T_RedisClient }) => {
	login({ app, jwtKey, redisClient });
	register({ app });
	update({ app });
	deleteRoute({ app });
	queryAll({ app });
};
