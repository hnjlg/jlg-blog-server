import { Application } from 'express';
import addError from './addError';

export default ({ app }: { app: Application }) => {
	addError({ app });
};
