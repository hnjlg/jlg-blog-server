module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'eslint-config-prettier',
		'eslint:recommended', // 使用推荐的eslint
		'plugin:@typescript-eslint/recommended',
		//1.继承.prettierrc.js文件规则  2.开启rules的 "prettier/prettier": "error"  3.eslint fix的同时执行prettier格式化
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
		parser: '@typescript-eslint/parser',
	},
	plugins: [],
	globals: {
		// 手动声明为全局变量
	},
	rules: {
		'no-prototype-builtins': 'warn', // 使用hasOwnProperty
		'prefer-const': 'error', // 优先使用const
		'no-console': 'warn', // 使用log
		'no-debugger': 'warn', // 使用debugger
		'@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '.*', args: 'none' }], //变量声明未使用
		'@typescript-eslint/no-explicit-any': 'warn', // ts使用any
		'@typescript-eslint/no-var-requires': 'off', // 使用require
		'no-unused-vars': 'error', // 变量未使用
	},
	ignorePatterns: [],
};
