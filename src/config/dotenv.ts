export default () => {
	if (process.env.NODE_ENV === 'development') {
		process.env.SERVER_URL = 'http://localhost:3000';
		process.env.SERVER_PORT = '3000';
	} else {
		process.env.SERVER_URL = 'https://guiding-evidently-sawfly.ngrok-free.app';
		process.env.SERVER_PORT = '9000';
	}
};
