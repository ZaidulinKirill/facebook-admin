export const state = () => ({
  navigationDrawer: false,
  error: null,
  alert: null,
  isAlertShown: false,
  isInitialized: false,
  isRefreshing: false,
  cookiesConsentAccepted: true,
  cookiesConsentDeclined: false,
  prefs: {
    csvDelimiter: ','
  }
})

export const mutations = {
  SET_INITIALIZED (state, value) {
    state.isInitialized = value
  },
  SET_PREFS (state, value) {
    state.prefs = value
  },
  SET_NAVIGATION_DRAWER (state, value) {
    state.navigationDrawer = value
  },
  SET_ERROR (state, error) {
    state.error = error
  },
  SET_ALERT (state, alert) {
    state.alert = alert
    state.isAlertShown = true
  },
  HIDE_ALERT (state) {
    state.isAlertShown = false
  },
  SET_IS_REFRESHING (state, value) {
    state.isRefreshing = value
  },
  ACCEPT_COOKIE_CONSENT (state, value) {
    state.cookiesConsentAccepted = true
    state.cookiesConsentDeclined = false
  },
  DECLINE_COOKIE_CONSENT (state, value) {
    state.cookiesConsentDeclined = true
    state.cookiesConsentAccepted = false
  }
}

export const actions = {
  clearCache ({ commit }, refetch = true) {
    const apollo = this.app.apolloProvider.defaultClient
    Object.keys(apollo.cache.data.data).forEach((key) => {
      apollo.cache.data.delete(key)
    })
  },
  refreshCache ({ commit }, refetch = true) {
    commit('SET_IS_REFRESHING', true)
    setTimeout(() => { commit('SET_IS_REFRESHING', false) }, 1000)

    const apollo = this.app.apolloProvider.defaultClient
    Object.keys(apollo.cache.data.data).forEach((key) => {
      apollo.cache.data.delete(key)
    })

    if (refetch) {
      setTimeout(() => { apollo.reFetchObservableQueries() }, 400)
    }
  }
}
