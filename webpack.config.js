const path = require('path');

// 打包先清理dist
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	entry: './src/index.ts', // 入口文件
	target: 'node', // 告诉 webpack 打包的代码将在 Node.js 环境中运行
	output: {
		path: path.resolve(__dirname, 'dist'), // 输出目录
		filename: 'bundle.js', // 输出文件名
	},
	resolve: {
		extensions: ['.ts', '.js'], // 告诉 webpack 在引入模块时可以省略文件扩展名
	},
	module: {
		rules: [
			{
				test: /\.ts$/, // 匹配 .ts 文件
				use: 'ts-loader', // 使用 ts-loader 来处理 .ts 文件
				exclude: /node_modules/, // 排除 node_modules 目录
			},
			{
				test: /\.yaml$/,
				use: 'yaml-loader',
			},
		],
	},
	plugins: [new CleanWebpackPlugin()],
};
