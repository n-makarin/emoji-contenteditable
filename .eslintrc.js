module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs'
  ],
  rules: {
    "no-console": "off",
    "no-empty-pattern": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/no-use-v-if-with-v-for": "off",
    "no-unsafe-finally": "off",
  }
}
