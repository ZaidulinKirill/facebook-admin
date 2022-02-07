module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  globals: {
    $nuxt: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    "indent": [
      "error",
      2,
      {
        "ignoredNodes": [
          "TemplateLiteral"
        ]
      }
    ],
    "template-curly-spacing": [
      "off"
    ],
    "valid-v-slot": "off",
    'vue/valid-v-slot': "off",
    'vue/no-v-html': 0
  }
}
