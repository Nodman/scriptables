/* eslint-disable no-magic-numbers */

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@scriptable-ios',
  ],

  rules: {
    'no-extra-parens': [
      'error',
      'all',
      {
        conditionalAssign: false,
        nestedBinaryExpressions: false,
        returnAssign: false,
        enforceForArrowConditionals: false,
        enforceForSequenceExpressions: false,
        enforceForNewInMemberExpressions: false,
        enforceForFunctionPrototypeMethods: false,
      },
    ],
    // https://eslint.org/docs/rules/no-invalid-regexp
    'no-invalid-regexp': 'error',

    // https://eslint.org/docs/rules/no-unreachable
    'no-unreachable': 'error',

    // https://eslint.org/docs/rules/no-unreachable-loop
    'no-unreachable-loop': 'error',

    // https://eslint.org/docs/rules/valid-typeof
    'valid-typeof': [
      'error',
      {
        requireStringLiterals: true,
      },
    ],

    // https://eslint.org/docs/rules/dot-location
    'dot-location': ['error', 'property'],

    // https://eslint.org/docs/rules/dot-notation
    'dot-notation': [
      'error',
      {
        allowKeywords: true,
      },
    ],

    // https://eslint.org/docs/rules/no-alert
    'no-alert': 'error',

    // https://eslint.org/docs/rules/no-else-return
    'no-else-return': [
      'error',
      {
        allowElseIf: false,
      },
    ],

    // https://eslint.org/docs/rules/no-eval
    'no-eval': 'error',

    // https://eslint.org/docs/rules/no-global-assign
    'no-global-assign': [
      'error',
      {
        exceptions: [],
      },
    ],
    // https://eslint.org/docs/rules/no-multi-spaces
    'no-multi-spaces': 'error',

    // https://eslint.org/docs/rules/no-multi-str
    'no-multi-str': 'error',

    // https://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Use Number.isFinite instead',
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Use Number.isFinite instead',
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Use Number.isNaN instead',
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Use Number.isNaN instead',
      },
      {
        property: '__defineGetter__',
        message: 'Use Object.defineProperty instead',
      },
      {
        property: '__defineSetter__',
        message: 'Use Object.defineProperty instead',
      },
      {
        object: 'require',
        message: 'Please call require() directly.',
      },
    ],

    // https://eslint.org/docs/rules/no-useless-return
    'no-useless-return': 'error',

    // https://eslint.org/docs/rules/require-await
    'require-await': 'error',

    // https://eslint.org/docs/rules/vars-on-top
    'vars-on-top': 'error',

    // https://eslint.org/docs/rules/no-compare-neg-zero
    'no-compare-neg-zero': 'error',

    // https://eslint.org/docs/rules/no-cond-assign
    'no-cond-assign': 'error',

    // https://eslint.org/docs/rules/no-console
    'no-console': 'warn',

    // https://eslint.org/docs/rules/no-constant-condition
    'no-constant-condition': 'error',

    // https://eslint.org/docs/rules/no-control-regex
    'no-control-regex': 'error',

    // https://eslint.org/docs/rules/no-debugger
    'no-debugger': 'error',

    // https://eslint.org/docs/rules/no-undefined
    'no-undefined': 'off',

    'eol-last': ['error', 'always'],
    'no-mixed-spaces-and-tabs': 'error',

    // https://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': ['error', 'prefer-double'],

    // https://eslint.org/docs/rules/quotes
    quotes: ['error', 'single'],

    // https://eslint.org/docs/rules/block-spacing
    'block-spacing': ['error', 'always'],

    // https://eslint.org/docs/rules/array-bracket-spacing
    'array-bracket-spacing': ['error', 'never'],

    // https://eslint.org/docs/rules/no-whitespace-before-property
    'no-whitespace-before-property': 'error',

    // https://eslint.org/docs/rules/linebreak-style
    'linebreak-style': ['error', 'unix'],

    // https://eslint.org/docs/rules/multiline-comment-style
    'multiline-comment-style': ['warn', 'starred-block'],

    // https://eslint.org/docs/rules/multiline-comment-style
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],

    // https://eslint.org/docs/rules/brace-style
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true,
      },
    ],

    // https://eslint.org/docs/rules/no-multiple-empty-lines
    'no-multiple-empty-lines': [
      'error',
      {
        max: 2,
        maxEOF: 0,
        maxBOF: 0,
      },
    ],

    // https://eslint.org/docs/rules/key-spacing
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      },
    ],

    // https://eslint.org/docs/rules/no-trailing-spaces
    'no-trailing-spaces': [
      'error',
      {
        skipBlankLines: false,
        ignoreComments: false,
      },
    ],

    // https://eslint.org/docs/rules/no-underscore-dangle
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__', '__typename'],
        allowAfterThis: false,
        allowAfterSuper: false,
        enforceInMethodNames: false,
      },
    ],
    // https://eslint.org/docs/rules/object-curly-spacing
    'object-curly-spacing': [
      'error',
      'always',
      {
        arraysInObjects: true,
        objectsInObjects: true,
      },
    ],

    // https://eslint.org/docs/rules/padding-line-between-statements
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive',
      },

      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },

      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
    ],

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    // note you must disable the base rule as it can report incorrect errors
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    // note you must disable the base rule as it can report incorrect errors
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'comma',
          requireLast: true,
        },
        singleline: {
          delimiter: 'comma',
          requireLast: false,
        },
      },
    ],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-as-const.md
    '@typescript-eslint/prefer-as-const': 'warn',

    // note you must disable the base rule as it can report incorrect errors
    indent: 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 0,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        offsetTernaryExpressions: false,
        ignoredNodes: [],
        ignoreComments: false,
      },
    ],
    // note you must disable the base rule as it can report incorrect errors
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        suffix: ['T'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        suffix: ['I'],
      },
    ],
    // note you must disable the base rule as it can report incorrect errors
    'no-magic-numbers': 'off',
    '@typescript-eslint/no-magic-numbers': [
      'error',
      {
        ignore: [-1, 2, 0, 1, 1e2, 1e3],
        ignoreArrayIndexes: true,
        enforceConst: true,
        detectObjects: false,
        ignoreNumericLiteralTypes: true,
      },
    ],
    // note you must disable the base rule as it can report incorrect errors
    'keyword-spacing': 'off',
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: {
            after: true,
          },
          throw: {
            after: true,
          },
          case: {
            after: true,
          },
        },
      },
    ],
  },
}
