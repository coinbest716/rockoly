module.exports = {
  parser: "babel-eslint", // needed to make babel stuff work properly
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'prettier',
    'react-redux'
  ],
  extends: [
    'plugin:react-redux/recommended',
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "trailingComma": "es5",
        "singleQuote": true,
        "printWidth": 100
      }
    ],
    "import/no-unresolved": "off",
    'no-use-before-define': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'react/jsx-fragments': 'off',
    'arrow-body-style': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'linebreak-style': 'off',
    "indent": 'off',
    "react/jsx-indent": 'off',
    "react/jsx-indent-props": 'off',
    "react-redux/connect-prefer-named-arguments": 2,
    'react-redux/prefer-separate-component-file': 'off'
  },
};