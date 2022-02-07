<template>
  <v-menu>
    <template v-slot:activator="{ on: menuOn }">
      <v-tooltip bottom>
        <template #activator="{on}">
          <!-- style="margin-top: -1px;" -->
          <v-btn
            text
            style="margin-top: 8px;;"
            class="hidden-sm-and-down"
            v-on="{...on, ...menuOn}"
          >
            <span v-if="user" class="mr-3 hidden-md-and-down" style="opacity: 0.8;font-size:16px;text-transform: none;font-weight: 400;text-align: right;overflow-x: hidden;">{{ user.name || user.email }}</span>
            <v-icon style="margin-top:-2px;">
              {{ avatarIcon }}
            </v-icon>
          </v-btn>
          <v-btn
            text
            class="hidden-md-and-up"
            v-on="{...on, ...menuOn}"
          >
            <span v-if="user" class="mr-2 hidden-md-and-down" style="opacity: 0.8;font-size:16px;text-transform: none;font-weight: 400;">{{ user.name || user.email }}</span>
            <v-icon style="margin-top:-2px;">
              <!-- class="mt-1" -->
              {{ avatarIcon }}
            </v-icon>
          </v-btn>
        </template>
        Account
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="logout">
        <v-list-item-content>
          <v-list-item-title>
            <v-icon class="mr-2">
              mdi-power
            </v-icon>
            Logout
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('auth', ['user']),
    avatarIcon () {
      return 'mdi-exit-to-app'
    }
  },
  methods: {
    ...mapMutations('auth', ['SET_USER']),
    async logout () {
      try {
        await this.$axios.$post('/api/auth/logout')

        window.location.href = '/login'
      } catch (error) {
        this.SET_ERROR({ message: error.message })
      }
    }
  }
}
</script>
