import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
	plugins: [
		'@typescript-eslint',
		'@stylistic/ts'
	],
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	overrides: [
		{
			env: {
				node: true
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script'
			}
		},
		{
			files: ['*.ts'],
			parserOptions: {
				sourceType: 'module'
			}
		}
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module'
	},
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
		'prefer-template': ['error'],
		'no-const-assign': ['error'],
		camelcase: ['error'],
		'no-duplicate-imports': ['error'],
		'no-empty': ['error'],
		'object-curly-spacing': ['error', 'always'],
		eqeqeq: ['error', 'always'],
		'comma-spacing': [
			'error',
			{
				after: true
			}
		],
		complexity: ['error', { max: 3 }],
		'comma-dangle': ['error', 'never'],
		'max-len': ['error', { 'code': 100 }]
		// 'no-console': 'error'
	}
  }
];