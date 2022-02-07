<template>
  <div>
    <v-app-bar
      clipped-left
      color="toolbar"
      dark
      app
      height="60"
      dense
      class="pa-0"
    >
      <v-row
        no-gutters
        class="justify-space-between align-center"
        style="margin-left: -10px"
      >
        <v-col cols="auto" sm="4" class="d-flex align-center justify-start">
          <nuxt-link to="/" class="d-flex align-center pt-1">
            <img
              class="ml-3"
              src="/logo.png"
              style="width: 150px"
            >
          </nuxt-link>
        </v-col>

        <v-col cols="6" sm="8" class="d-flex align-center justify-end">
          <the-toolbar-account-button />
        </v-col>
      </v-row>
    </v-app-bar>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import TheToolbarAccountButton from '~/components/TheToolbarAccountButton'

export default {
  components: {
    TheToolbarAccountButton
  },
  computed: {
    ...mapState(['navigationDrawer']),
    ...mapState('auth', ['user']),
    isDisabled () {
      return this.$nuxt.$route.path !== '/' || !this.user
    },
    drawer: {
      get () {
        return this.navigationDrawer
      },
      set (value) {
        this.setDrawer(value)
      }
    }
  },
  methods: {
    ...mapMutations({ setDrawer: 'SET_NAVIGATION_DRAWER' }),
    ...mapMutations(['SET_ERROR'])
  }
}
</script>
