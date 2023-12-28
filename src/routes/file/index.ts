import { Application } from 'express';
import upload from './upload';

export default ({ app }: { app: Application }) => {
	upload({ app });
};
