export default ({ graphQLErrors, networkError, operation, forward, ...rest }, { store, redirect }) => {
  console.info(graphQLErrors, networkError, operation, forward, rest)
  const isAuthError = (graphQLErrors || []).find(x => (x.message || '').includes('not found') ||
  (x.message || '').includes('no such type'))

  if (isAuthError) {
    // if (isSessionError) {
    //   store.commit('SET_ERROR', {
    //     message: 'RadioLogr is started on another device'
    //   })
    // }

    redirect('/login')
  }
}
