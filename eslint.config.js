import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import unusedImports from 'eslint-plugin-unused-imports'

export default [
  {
    ignores: ['dist', 'node_modules', 'tools/mcp/node_modules', 'scripts/archive', '.claude'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Tandai identifier yang dipakai di JSX sebagai "terpakai"
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'error',
      // catch {} kosong dipakai sengaja untuk menelan error non-kritis
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    // Server MCP & script Node berjalan di Node, bukan browser
    files: ['tools/**/*.js', 'scripts/**/*.{js,cjs}', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
]
