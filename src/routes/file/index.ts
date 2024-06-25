import { Application } from 'express';
import upload from './upload/upload';

export default ({ app }: { app: Application }) => {
	upload({ app });
};
