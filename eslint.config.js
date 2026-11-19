import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
    ],
  },

  js.configs.recommended,
  ...vue.configs['flat/recommended'],

  prettier,

  {
    files: ['**/*.{js,mjs,cjs,vue}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // Variables
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Console logging
      'no-console': 'off',

      // General quality
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Vue
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
        },
      ],

      // Prefer warnings during migration
      'vue/no-unused-components': 'warn',
    },
  },
];
