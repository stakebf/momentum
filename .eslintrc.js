module.exports = {
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'airbnb-base',
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    parser: 'babel-eslint',
    rules: {
      'class-methods-use-this': 0,
      'import/no-named-as-default': 0,
      'import/no-named-as-default-member': 0,
      'arrow-body-style': 0,
      'lines-between-class-members': 0
    },
    plugins: ['babel'],
  };
  