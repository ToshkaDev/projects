module.exports = {
	env: {
		node: true,
		mocha: true,
		es6: true
	},
	globals: {
		expect: true,
		expectRejection: true,
		sinon: true
	},
	parserOptions: {
		ecmaVersion: 6
	},
	rules: {
		// Possible errors
		'comma-dangle': [2, 'never'],
		'no-cond-assign': 2,
		'no-console': 1,
		'no-constant-condition': 1,
		'no-control-regex': 2,
		'no-debugger': 1,
		'no-dupe-args': 2,
		'no-dupe-keys': 2,
		'no-duplicate-case': 2,
		'no-empty': 2,
		'no-empty-character-class': 2,
		'no-ex-assign': 2,
		'no-extra-boolean-cast': 2,
		'no-extra-parens': 0,
		'no-extra-semi': 2,
		'no-func-assign': 2,
		'no-inner-declarations': 0,
		'no-invalid-regexp': 2,
		'no-irregular-whitespace': 2,
		'no-negated-in-lhs': 2,
		'no-obj-calls': 1,
		'no-regex-spaces': 1,
		'no-sparse-arrays': 2,
		'no-unexpected-multiline': 2,
		'no-unreachable': 1,
		'no-unsafe-finally': 2,
		'use-isnan': 2,
		'valid-jsdoc': [1, {
			prefer: {
				return: 'returns'
			},
			requireParamDescription: false,
			requireReturn: false,
			requireReturnDescription: false
		}],
		'valid-typeof': 2,

		// Best practices
		'accessor-pairs': 2,
		'array-callback-return': 1,
		'block-scoped-var': 2,
		'complexity': 0,
		'consistent-return': 2,
		'curly': [2, 'multi-or-nest', 'consistent'],
		'default-case': 0,
		'dot-location': [2, 'property'],
		'dot-notation': 1,
		'eqeqeq': [2, 'smart'],
		'guard-for-in': 0,
		'no-alert': 2,
		'no-caller': 2,
		'no-case-declarations': 2,
		'no-div-regex': 0,
		'no-else-return': 2,
		'no-empty-function': 0,
		'no-empty-pattern': 2,
		'no-eq-null': 2,
		'no-eval': 1,
		'no-extend-native': 2,
		'no-extra-bind': 2,
		'no-extra-label': 2,
		'no-fallthrough': 0,
		'no-floating-decimal': 0,
		'no-implicit-coercion': [2, {allow: ['!!']}],
		'no-implicit-globals': 2,
		'no-implied-eval': 2,
		'no-invalid-this': 2,
		'no-iterator': 1,
		'no-labels': 1,
		'no-lone-blocks': 2,
		'no-loop-func': 2,
		'no-magic-numbers': [2, {ignore: [-1, 0, 1], ignoreArrayIndexes: true}],
		'no-multi-spaces': 2,
		'no-multi-str': 1,
		'no-native-reassign': 2,
		'no-new': 2,
		'no-new-func': 2,
		'no-new-wrappers': 2,
		'no-octal': 2,
		'no-octal-escape': 2,
		'no-param-reassign': 1,
		'no-proto': 2,
		'no-redeclare': 2,
		'no-return-assign': 2,
		'no-script-url': 2,
		'no-self-assign': 2,
		'no-self-compare': 2,
		'no-sequences': 2,
		'no-throw-literal': 2,
		'no-unmodified-loop-condition': 2,
		'no-unused-expressions': 2,
		'no-unused-labels': 2,
		'no-useless-call': 2,
		'no-useless-concat': 2,
		'no-useless-escape': 2,
		'no-void': 2,
		'no-warning-comments': [1, { 'terms': ['todo', 'fixme'], 'location': 'start' }],
		'no-with': 2,
		'radix': 0,
		'vars-on-top': 0,
		'wrap-iife': [2, 'inside'],
		'yoda': [2, 'never'],

		// Strict mode
		'strict': [2, 'global'],

		// Variables
		'init-declarations': 2,
		'no-catch-shadow': 0,
		'no-delete-var': 2,
		'no-label-var': 2,
		'no-restricted-globals': 0,
		'no-shadow': 2,
		'no-shadow-restricted-names': 2,
		'no-undef': 2,
		'no-undef-init': 2,
		'no-undefined': 2,
		'no-unused-vars': [1, {args: 'none'}],		// No arg checking so that function signatures may be preserved
		'no-use-before-define': [2, 'nofunc'],

		// Node specific
		'callback-return': 0,
		'global-require': 2,
		'handle-callback-err': [2, 'error'],
		'no-mixed-requires': [1, false /* grouping */],
		'no-new-require': 2,
		'no-path-concat': 2,
		'no-process-env': 0,
		'no-process-exit': 0,
		'no-restricted-modules': 0,
		'no-sync': 0,

		// Styling
		'array-bracket-spacing': 2,
		'block-spacing': 2,
		'brace-style': [2, 'stroustrup', {allowSingleLine: false}],
		'camelcase': [2, {properties: 'never'}],
		'comma-spacing': [2, {before: false, after: true}],
		'comma-style': [2, 'last', {exceptions: {ArrayExpression: true, ObjectExpression: true}}],
		'computed-property-spacing': 2,
		'consistent-this': [2, 'self'],
		'eol-last': 2,
		'func-names': 0,
		'func-style': 0,
		'id-blacklist': 0,
		'id-length': 0,
		'id-match': 0,
		'indent': [2, 'tab', {'SwitchCase': 1}],
		'jsx-quotes': [2, 'prefer-double'],
		'key-spacing': [2, {beforeColon: false, afterColon: true}],
		'keyword-spacing': [2, {before: true, after: true}],
		'linebreak-style': [2, 'unix'],
		'lines-around-comment': 0,
		'max-depth': 0,
		'max-len': 0,
		'max-nested-callbacks': 0,
		'max-params': 0,
		'max-statements': 0,
		// TODO: change to max: 1 when eslint fixes this bug
		'max-statements-per-line': [2, {max: 2}],
		'new-cap': [2, {newIsCap: true, capIsNew: true}],
		'new-parens': 2,
		'newline-after-var': 0,
		'newline-before-return': 0,
		'newline-per-chained-call': [2, {ignoreChainWithDepth: 2}],
		'no-array-constructor': 2,
		'no-bitwise': 0,
		'no-continue': 0,
		'no-inline-comments': 0,
		'no-lonely-if': 2,
		'no-mixed-spaces-and-tabs': 2,
		'no-multiple-empty-lines': [2, {max: 2}],
		'no-negated-condition': 0,
		'no-nested-ternary': 2,
		'no-new-object': 2,
		'no-plusplus': 0,
		'no-restricted-syntax': 0,
		'no-spaced-func': 2,
		'no-ternary': 0,
		'no-trailing-spaces': [2, {skipBlankLines: false}],
		'no-underscore-dangle': 0,
		'no-unneeded-ternary': 2,
		'no-whitespace-before-property': 2,
		'object-curly-spacing': [2, 'never'],
		'one-var': 0,
		'one-var-declaration-per-line': [2, 'always'],
		'operator-assignment': 2,
		'operator-linebreak': [2, 'after'],
		'padded-blocks': [2, 'never'],
		'quote-props': [2, 'as-needed'],
		'quotes': [2, 'single', 'avoid-escape'],
		'require-jsdoc': 0,
		'semi': [2, 'never'],
		'semi-spacing': [2, {'before': false, 'after': true}],
		'sort-vars': 0,
		'space-before-blocks': [2, 'always'],
		'space-before-function-paren': [2, 'never'],
		'space-in-parens': [2, 'never'],
		'space-infix-ops': 2,
		'space-unary-ops': [1, {words: true, nonwords: false }],
		'spaced-comment': [2, 'always', {exceptions: ['-']}],
		'wrap-regex': 0,

		// ES6
		'arrow-body-style': 0,
		'arrow-parens': [2, 'always'],
		'arrow-spacing': [2, {before: true, after: true}],
		'constructor-super': 2,
		'generator-star-spacing': [2, {before: true, after: false}],
		'no-class-assign': 2,
		'no-confusing-arrow': [2, {allowParens: true}],
		'no-const-assign': 2,
		'no-dupe-class-members': 2,
		'no-duplicate-imports': 2,
		'no-new-symbol': 2,
		'no-restricted-imports': 0,
		'no-this-before-super': 2,
		'no-useless-computed-key': 2,
		'no-useless-constructor': 2,
		'no-var': 2,
		'object-shorthand': [2, 'properties'],
		'prefer-arrow-callback': 0,
		'prefer-const': 0,
		'prefer-reflect': 2,
		'prefer-rest-params': 2,
		'prefer-spread': 2,
		'prefer-template': 0,
		'require-yield': 1,
		'sort-imports': 0,
		'template-curly-spacing': [2, 'never'],
		'yield-star-spacing': [2, {before: true, after: false}]
	}
}
