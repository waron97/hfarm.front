// prettier-ignore

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'operator-linebreak': 0,
    'object-curly-spacing': ['error', 'always'],
    'indent': ['off', 2],
    'linebreak-style': 0,
    'comma-dangle': ['off', 'never'],
    'valid-jsdoc': 'off',
    'no-invalid-this': 'off',
    'require-jsdoc': [
      0,
      {
        require: {
          FunctionDeclaration: false,
          MethodDefinition: false,
          ClassDeclaration: false,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
  },
};
