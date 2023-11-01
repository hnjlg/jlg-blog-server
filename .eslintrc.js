module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended', // 使用推荐的eslint
		//1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
		'plugin:prettier/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		parser: '@typescript-eslint/parser',
	},
	plugins: [],
	globals: {
		// 因为自动导入了vue,手动声明为全局变量
	},
	rules: {
		'no-prototype-builtins': 'error', // 允许使用hasOwnProperty
		'prefer-const': 'error', // 优先使用const
		'@typescript-eslint/ban-types': 'error', // 禁止使用一些类型
		'no-undef': ['error', { typeof: false }], // 不允许使用未定义的变量
		'no-console': 'warn', // 不允许使用log
		'no-debugger': 'warn', // 不允许使用debugger
		'@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '.*', args: 'none' }], //变量声明未使用
		'@typescript-eslint/no-explicit-any': 'error', // 不允许ts使用any
		'@typescript-eslint/no-var-requires': 'error', // 强制使用 import 且不允许使用 require 设置off关闭检查
		'no-unused-vars': 'error', // 不能定义未使用的变量
	},
	// 忽略的文件
	ignorePatterns: [],
};
