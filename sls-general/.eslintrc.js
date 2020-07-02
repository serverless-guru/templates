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
        'max-nested-callbacks': ["error", { "max": 5 }],
        'max-depth': ["warn", 4],
        "max-lines-per-function": ["warn", 50]
    }
}