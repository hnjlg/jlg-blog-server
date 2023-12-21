import { Application } from 'express';
import getUserRouter from './getUserRouter';

export default ({ app, jwtKey }: { app: Application; jwtKey: string }) => {
	getUserRouter({ app, jwtKey });
};
