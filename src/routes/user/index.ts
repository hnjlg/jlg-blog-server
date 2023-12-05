import { Application } from 'express';
import login from './login';
import register from './register';
import update from './update';
import deleteRoute from './delete';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	login({ app, jwtKey });
	register({ app });
	update({ app });
	deleteRoute({ app });
};
