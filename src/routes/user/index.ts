import login from './login';

import { Application } from 'express';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	login({ app, jwtKey });
};
