// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
    },
    env: {
        node: true,
        browser: true,
        es2017: true
    },
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    rules: {
        "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
    globals: {

    }
}