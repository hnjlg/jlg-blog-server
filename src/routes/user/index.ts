import { Application } from 'express';
import login from './login';
import register from './register';
import update from './update';
import deleteRoute from './delete';
import queryAll from './queryAll';
import { T_RedisClient } from '../../global';

export default ({ app, jwtKey, redisClient }: { app: Application; jwtKey: string; redisClient: T_RedisClient }) => {
	login({ app, jwtKey, redisClient });
	register({ app });
	update({ app });
	deleteRoute({ app });
	queryAll({ app });
};
