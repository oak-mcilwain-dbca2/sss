import js from '@eslint/js';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
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
        $: 'readonly',
        jQuery: 'readonly',
        moment: 'readonly',
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

      // Relax during migration
      eqeqeq: 'off',
      curly: 'off',

      'no-empty': 'warn',
      'no-prototype-builtins': 'warn',
      'no-useless-assignment': 'warn',

      // Vue
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'vue/order-in-components': 'off',

      // Vue 1 legacy patterns
      'vue/no-deprecated-events-api': 'off',

      // Keep useful checks
      'vue/no-unused-components': 'warn',
    },
  },
];
