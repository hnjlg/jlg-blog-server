import dotenv from 'dotenv';

export default () => {
	if (process.env.NODE_ENV === 'production') {
		dotenv.config({
			path: '.env.production',
		});
	} else {
		dotenv.config({
			path: '.env.build',
		});
	}
};
