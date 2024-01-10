export default process.env.NODE_ENV === 'development'
	? {
			host: '192.168.13.225', // 服务器地址
			user: 'root', // mysql用户名称
			password: '123456', // mysql用户密码
			port: 3306, // 端口
			database: 'express_test', // 数据库名称
	  }
	: {
			host: '101.132.70.183', // 服务器地址
			user: 'root', // mysql用户名称
			password: 'Mcw-1340739521', // mysql用户密码
			port: 3306, // 端口
			database: 'jlg-blog-server', // 数据库名称
	  };
