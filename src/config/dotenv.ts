export default () => {
	if (process.env.NODE_ENV === 'production') {
		process.env.SERVER_URL = 'http://localhost:3000';
		process.env.SERVER_PORT = '3000';
	} else {
		process.env.SERVER_URL = 'http://101.132.70.183:10091';
		process.env.SERVER_PORT = '10091';
	}
};
