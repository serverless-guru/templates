module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true,
        jest: true
    },
    extends: 'eslint:recommended',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        fetch: false,
        process: true
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        'no-var': 'warn',
        'no-console': 'warn',
        'max-nested-callbacks': ["error", { "max": 5 }],
        // 'max-depth': ["warn", 4],
        // "max-lines-per-function": ["warn", 200]
        // curly: 'warn',
        // 'no-caller': 'warn',
        // 'no-eval': 'warn',
        // 'no-throw-literal': 'warn',
        // 'no-trailing-spaces': 'warn',
        // 'no-undef-init': 'warn',
        // 'no-unused-expressions': 'warn',
        // 'prefer-const': 'warn',
        // 'no-extra-semi': 'warn',
        // 'no-new-wrappers': 'warn',
        // eqeqeq: ['warn', 'smart'],
        // 'keyword-spacing': 'warn',
        // 'comma-spacing': 'warn',
        // 'semi-spacing': 'warn',
        // 'no-unused-vars': 'warn',
        // 'no-prototype-builtins': 'warn',
        // 'no-undef': 'warn',
        // 'no-self-assign': 'warn',
        // 'no-redeclare': 'warn'
    }
}
