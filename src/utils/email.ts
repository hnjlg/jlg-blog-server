import nodemailer from 'nodemailer';

export const sendEmail = (mailOptions: { to: string; subject: string; text: string; html: string }) => {
	// 校验to是不是邮箱格式
	const transporter = nodemailer.createTransport({
		service: 'qq',
		auth: {
			user: '3147691361@qq.com', // 发送邮件的邮箱地址
			pass: 'gxamroorfgvtdfae', // 发送邮件的邮箱密码或授权码
		},
	});

	transporter.sendMail(
		{
			from: '3147691361@qq.com', // 发件人邮箱地址
			...mailOptions,
		},
		function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		}
	);
};
