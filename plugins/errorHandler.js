export default function ({ $axios, app, redirect, store, route }) {
  $axios.onError((error) => {
    if (window.location.href.includes('/login') || window.location.href.includes('/signup')) {
      return
    }

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // if (localStorage.getItem('vuex') && (JSON.parse(localStorage.getItem('vuex')).auth || {}).user) {
      //   store.commit('SET_ERROR', {
      //     message: 'RadioLogr is started on another device'
      //   })
      // }

      redirect('/login')
      return
    }

    const responseData = error && error.response && error.response.data
    store.commit('SET_ERROR', {
      message: typeof responseData === 'string' ? responseData : error.message
    })
  })
}
