import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'vuex',
    paths: [
      'prefs',
      'auth.user',
      'cookiesConsentAccepted',
      'cookiesConsentDeclined'
    ]
  })(store)
}
