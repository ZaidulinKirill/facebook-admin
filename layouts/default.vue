<template>
  <v-app class="notranslate">
    <style v-if="user" v-html="fontsCss" />
    <v-main>
      <the-navigation />
      <the-toolbar />
      <v-container fluid style="overflow-x: auto;" class="flex-grow-1">
        <nuxt />
      </v-container>
    </v-main>
    <the-error-alert />
    <the-action-alert />
    <v-snackbar
      :timeout="1000000"
      :value="!cookiesConsentAccepted && !cookiesConsentDeclined"
      max-width="1000"
      left
      absolute
      shaped
      multi-line
      color="#2a3042"
      class="custom-snackbar"
    >
      We use cookies to improve user experience, and analyze website traffic. For these reasons, we may share your site usage data with our analytics partners. By clicking “Accept”, you consent to store on your device all the technologies described in our <a href="/cookie-policy" target="_blank" style="color: white;">Cookie Policy</a>.
      <template v-slot:action="{ attrs }">
        <div class="d-flex flex-column">
          <v-btn
            color="#f5af43"
            text
            v-bind="attrs"
            @click="acceptCookieConsent"
          >
            Accept
          </v-btn>
          <v-btn
            color="#f5af43"
            text
            class="mt-2"
            v-bind="attrs"
            @click="declineCookieConsent"
          >
            Decline
          </v-btn>
        </div>
      </template>
    </v-snackbar>
    <v-snackbar
      :timeout="1000000"
      :value="cookiesConsentDeclined"
      max-width="1000"
      left
      shaped
      absolute
      multi-line
      color="#2a3042"
      class="custom-snackbar"
    >
      Unfortunately we can't offer our service without using cookies described in the <a href="/cookie-policy" target="_blank" style="color: white;">Cookie Policy</a>.
      <template v-slot:action="{ attrs }">
        <div class="d-flex flex-column">
          <v-btn
            color="#f5af43"
            text
            v-bind="attrs"
            @click="acceptCookieConsent"
          >
            Accept cookies
          </v-btn>
        </div>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import TheNavigation from '~/components/TheNavigation'
import TheToolbar from '~/components/TheToolbar'
import TheErrorAlert from '~/components/TheErrorAlert'
import TheActionAlert from '~/components/TheActionAlert'

export default {
  components: {
    TheNavigation,
    TheToolbar,
    TheErrorAlert,
    TheActionAlert
  },
  computed: {
    ...mapState(['isInitialized', 'cookiesConsentDeclined', 'cookiesConsentAccepted']),
    ...mapState(['isSettingsDialogShown']),
    ...mapState('auth', ['user']),
    fontsCss () {
      return this.user.fonts.map(font => `@import url('${font.url}');`).join('\n')
    }
  },
  mounted () {
    setInterval(() => { this.clearCache() }, 10000)
  },
  methods: {
    ...mapMutations(['SET_ERROR', 'SET_ALERT', 'ACCEPT_COOKIE_CONSENT', 'DECLINE_COOKIE_CONSENT']),
    ...mapActions(['clearCache']),
    acceptCookieConsent () {
      this.ACCEPT_COOKIE_CONSENT(true)
    },
    declineCookieConsent () {
      this.DECLINE_COOKIE_CONSENT(true)
    }
  }
}
</script>
<style>
.v-main__wrap {
  display: flex;
  flex-direction: column;
}
</style>
