module.exports = {
  mode: 'universal',

  build: {
    vendor: [
    ],
    /*
    ** You can extend webpack config here
    */
    postcss: [
      require('autoprefixer')({
        browsers: ['> 5%']
      })
    ],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: { fix: true }
        })
      }
    }
  }
}