export default process.env.NODE_ENV === 'development'
	? {
			host: 'localhost', // 服务器地址
			user: 'root', // mysql用户名称
			password: 'LiuJie990703', // mysql用户密码
			port: 3306, // 端口
			database: 'express_test', // 数据库名称
	  }
	: {
			host: 'localhost', // 服务器地址
			user: 'root', // mysql用户名称
			password: 'LiuJie990703', // mysql用户密码
			port: 3306, // 端口
			database: 'express-server', // 数据库名称
	  };
