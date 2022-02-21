<template>
  <v-navigation-drawer
    :value="true"
    clipped
    fixed
    mini-variant
    :mobile-breakpoint="0"
    stateless
    app
    @input="drawer = $vuetify.breakpoint.mdAndUp ? true : $event"
  >
    <v-list nav dense>
      <navigation-list-link
        v-for="(item, i) in filteredItems"
        :key="i"
        :to="item.link"
        :icon="item.icon"
        :text="item.plural"
        :error="item.error"
        :click="item.click"
        show-tooltip
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import NavigationListLink from '~/components/NavigationListLink'
import { Roles } from '~/constants'

const { ADMIN, CLIENT } = Roles

export default {
  components: {
    NavigationListLink
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['navigationDrawer', 'isWidePage', 'stations']),
    ...mapState('auth', ['user']),
    miniVariant () {
      return this.$vuetify.breakpoint.mdAndUp ? !this.drawer : undefined
    },
    filteredItems () {
      return this.items.filter(({ roles }) => !roles || roles.includes(this.user.role))
    },
    items () {
      return [
        { link: '/dashboard', plural: 'Site', icon: 'mdi-earth', roles: [CLIENT] },
        { link: '/media', plural: 'Media', icon: 'mdi-folder-multiple-image', roles: [CLIENT] },
        { link: '/sites', plural: 'Sites', icon: 'mdi-earth', roles: [ADMIN] },
        { link: '/posts', plural: 'Posts', icon: 'mdi-text-long', roles: [ADMIN] },
        { link: '/messages', plural: 'Messages', icon: 'mdi-message-text-outline', roles: [ADMIN] },
        { link: '/languages', plural: 'Languages', icon: 'mdi-translate', roles: [ADMIN] },
        { link: '/fonts', plural: 'Fonts', icon: 'mdi-format-font', roles: [ADMIN] },
        { link: '/uploads', plural: 'Uploads', icon: 'mdi-cloud-upload', roles: [ADMIN] },
        { link: '/users', plural: 'Users', icon: 'mdi-card-account-details', roles: [ADMIN] }
        // { link: '/modules', plural: 'Modules', icon: 'mdi-puzzle', roles: [ADMIN] },
        // { link: '/settings', plural: 'Configuration', icon: 'mdi-cog', roles: [ADMIN] }
      ]
    },
    drawer: {
      get () {
        return this.navigationDrawer && (this.$vuetify.breakpoint.smAndDown)
      },
      set (value) {
        this.SET_NAVIGATION_DRAWER(value)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_NAVIGATION_DRAWER', 'SET_IS_SETTINGS_DIALOG'])
  }
}
</script>
