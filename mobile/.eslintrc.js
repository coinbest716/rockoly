module.exports = {
    root: true,
    extends: '@react-native-community',
    parser: "babel-eslint", // needed to make babel stuff work properly
    env: {
      browser: true,
      es6: true,
    },
    extends: [
      'airbnb',
      "prettier",
      "prettier/react",
      "plugin:prettier/recommended",
      "eslint-config-prettier"
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
      'prettier'
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
      'arrow-body-style' : 'off',
      'react/jsx-one-expression-per-line': 'off',
      'linebreak-style': 'off',
      "indent": 'off',
      "react/jsx-indent": 'off',
      "react/jsx-indent-props": 'off',
      "import/no-extraneous-dependencies": ["error", {"packageDir": ['./',]}],
      'react/static-property-placement': 'off',
      'react/require-default-props': 'off',
      'react/forbid-prop-types': 'off',
      'no-underscore-dangle': 'off',
      'react/state-in-constructor': 'off',
      'no-debugger': 'off',
      'import/prefer-default-export':'off',
      'react/jsx-props-no-spreading': 'off'
    },
  };
  