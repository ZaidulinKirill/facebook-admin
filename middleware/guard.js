import { Roles } from '~/constants'

const { ADMIN, CLIENT } = Roles

const rules = {
  '*': {
    allow: [ADMIN]
  },
  all: {
    allow: [ADMIN, CLIENT]
  },
  dashboard: {
    allow: [CLIENT]
  },
  media: {
    allow: [CLIENT]
  }
}

const getDefaultUserPage = (user) => {
  return '/'
}

export default function ({ store, route, redirect, app }) {
  const [meta] = route.meta
  if (meta.public) {
    return
  }

  if (!store.state.auth.user) {
    redirect('/login')
  }

  const rule = rules[route.name]
    ? rules[route.name]
    : rules['*']

  if (!rule.allow.includes(store.state.auth.user.role)) {
    const defaultPath = getDefaultUserPage(store.state.auth.user)
    redirect(defaultPath)
  }
}
