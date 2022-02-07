import colors from 'vuetify/es5/util/colors'
import pkg from './package'

const getApolloEndpoint = () => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      httpEndpoint: 'http://localhost:8080/v1/graphql',
      wsEndpoint: 'ws://localhost:8080/v1/graphql'
    }
  } else {
    return {
      httpEndpoint: 'https://radioatwork.be/v1/graphql',
      wsEndpoint: 'wss://radioatwork.be/v1/graphql',
      browserHttpEndpoint: '/v1/graphql'
    }
  }
}

export default {
  ssr: false,

  /*
   ** Headers of the page
   */
  head: {
    title: 'Facebook at work',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
      { name: 'google', content: 'notranslate' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      // { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      // { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      // { rel: 'manifest', href: '/webmanifest.json' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', sizes: '180x180', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/site.scss'
  ],

  /*
   ** Global middlewares
   */
  router: {
    middleware: ['auth', 'guard']
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/persistStorage.js',
    '~/plugins/errorHandler.js',
    '~/plugins/useSchemaForm.js',
    '~/plugins/useSchemaTable.js',
    '~/plugins/useHasuraTable.js',
    '~/plugins/useHasuraForm.js'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/proxy',
    '@nuxtjs/axios',
    '@nuxtjs/apollo'
  ],

  /*
   ** Nuxt.js build modules
   */
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/vuetify'
  ],

  /*
   ** Moment.js configuration
   */
  moment: {
    timezone: {
      startYear: 2019,
      endYear: 2060
    }
  },

  /*
   ** Axios module configuration
   */
  axios: {
    ...process.env.NODE_ENV === 'production' ? { baseURL: process.env.API_ENDPOINT } : {},
    // proxy: process.env.NODE_ENV !== 'production',
    progress: false
  },

  // ...process.env.NODE_ENV !== 'production' && {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:4000'
  //     }
  //   }
  // },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  apollo: {
    clientConfigs: {
      default: {
        ...getApolloEndpoint(),
        httpLinkOptions: {
          headers: {
            'X-Admin-Dashboard': 'true'
          },
          credentials: 'include'
        }
      }
    },
    errorHandler: '~/plugins/apolloErrorHandler.js'
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    // customVariables: ['~/assets/variables.scss'],
    defaultAssets: {
      font: false
    },
    // treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          toolbar: '#2A3042',
          // primary: '#3f51b5',
          primary: '#2A3042',
          primaryAlt: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: '#424242',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    babel: {
      presets ({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 }
            }
          ]
        ]
      }
    }
  }
}
