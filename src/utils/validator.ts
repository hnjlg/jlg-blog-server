// 判断是否是一个有效的URL
export const isValidURL = (url: string) => {
	const pattern = new RegExp(
		'^(https?:\\/\\/)?' + // 协议
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // 域名
			'((\\d{1,3}\\.){3}\\d{1,3}))' + // IP地址
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // 端口和路径
			'(\\?[;&a-z\\d%_.~+=-]*)?' + // 查询字符串
			'(\\#[-a-z\\d_]*)?',
		'i'
	); // 锚点
	return pattern.test(url);
};

// 判断是否是一个JSON格式字符串
export const isJSONString = (str: string) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
};
