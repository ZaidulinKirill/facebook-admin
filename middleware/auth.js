const initialize = async ({ store, route, redirect, $axios, $vuetify }) => {
  const [meta] = route.meta

  if (!meta.public) {
    try {
      const user = await $axios.$get('/api/auth')
      if (!user) {
        throw (new Error('Not found'))
      }

      store.commit('auth/SET_USER', user, { root: true })

      store.commit('SET_INITIALIZED', true)
    } catch (err) {
      redirect('/login')
    }
  }
}

export default async function (ctx) {
  if (!ctx.store.state.isInitialized) {
    await initialize(ctx)
  }
}
