import { Application } from 'express';
import searchAll from './searchAll';
import deleteById from './deleteById';

export default ({ app }: { app: Application }) => {
	searchAll({ app });
	deleteById({ app });
};
