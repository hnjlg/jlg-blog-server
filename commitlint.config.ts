export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [
			2,
			'always',
			[
				'build', // 修改构建系统或者外部依赖项
				'chore', // 构建过程或辅助工具的变动
				'ci', // 持续集成相关的修改
				'docs', // 文档的修改
				'feat', // 新功能
				'fix', // 修复bug
				'perf', // 性能优化
				'refactor', // 代码重构（不包括 bug 修复、功能新增）
				'revert', // 恢复上一次的提交
				'style', // 代码格式修改（不影响功能，例如空格、分号等格式修正）
				'test', // 测试用例的修改
			],
		],
		'type-empty': [2, 'never'], // never: type不能为空; always: type必须为空
		'type-case': [0, 'always', 'lower-case'], // type必须小写，upper-case大写，camel-case小驼峰，kebab-case短横线，pascal-case大驼峰，等等
		'scope-empty': [0],
		'scope-case': [0],
		'subject-empty': [2, 'never'], // subject不能为空
		'subject-case': [0],
		'subject-full-stop': [0, 'never', '.'], // subject以.为结束标记
		'header-max-length': [2, 'always', 200], // header最长200
		'body-leading-blank': [0], // body换行
		'footer-leading-blank': [0, 'always'], // footer以空行开头
	},
};
