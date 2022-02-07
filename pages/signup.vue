<template>
  <v-row class="login-form fill-height">
    <v-col cols="12">
      <v-row justify="center">
        <v-col cols="12" sm="12" md="6">
          <v-card class="elevation-5">
            <v-sheet color="toolbar">
              <login-form-title />
            </v-sheet>
            <v-card-text class="pt-3">
              <schema-form ref="form" :fields="fields" @submit="signup">
                <template #field.isConfirmed.label="{item}">
                  I have read and accept&nbsp;<a style="z-index:100;" href="/terms-and-conditions" target="_blank" @click.stop="() =>{}">Term & Conditions</a>
                </template>
              </schema-form>
              <p>
                Your personal data will be processed in accordance with our &nbsp;<a style="z-index:100;" href="/privacy-policy" target="_blank" @click.stop="() =>{}">Privacy Policy</a>
              </p>
              <v-btn class="primary" block :loading="loading" @click="$refs.form.submit()">
                Confirm
              </v-btn>
              <div class="d-flex  align-center mt-3">
                <v-spacer />
                Already have an account?
                <v-btn
                  x-small
                  class="px-1"
                  text
                  nuxt
                  :to="'/login'"
                >
                  <u>Sign in</u>
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'
import { SchemaForm } from 'vuetify-schema-form'
import LoginFormTitle from '~/components/LoginFormTitle'

export default {
  name: 'Login',
  layout: 'plain',
  meta: {
    public: true
  },
  components: {
    SchemaForm,
    LoginFormTitle
  },
  data () {
    return {
      inviteToken: null,
      loading: false
    }
  },
  computed: {
    fields () {
      return [
        { label: 'Name', value: 'name', required: true, prependIcon: 'mdi-badge-account-horizontal-outline' },
        {
          label: 'E-mail',
          value: 'email',
          required: true,
          type: 'email',
          prependIcon: 'mdi-at',
          md: 6
        },
        { label: 'Password', value: 'password', required: true, type: 'password', prependIcon: 'mdi-lock', md: 6 },
        { value: 'isConfirmed', required: true, type: 'checkbox' }
      ]
    }
  },
  mounted () {
    this.SET_USER(null)
    // if (this.$nuxt.$route.query.t) {
    //   this.inviteToken = await this.$axios.$get(`/api/tokens/${this.$nuxt.$route.query.t}`)
    // }
  },
  methods: {
    ...mapMutations(['SET_ERROR', 'SET_ALERT']),
    ...mapMutations('auth', ['SET_USER']),
    async signup (info) {
      const inputs = [...this.$refs.form.$el.querySelectorAll('input')]

      this.loading = true
      try {
        await this.$axios.$post('/api/auth/signup', {
          name: inputs[0].value,
          email: (inputs[1].value || '').toLowerCase(),
          password: inputs[2].value
        })

        const user = await this.$axios.$post('/api/auth/login', {
          email: (inputs[1].value || '').toLowerCase(),
          password: inputs[2].value
        })

        this.SET_ALERT({
          message: 'Account created successfully!',
          actionText: 'Login',
          action: () => {
            this.SET_USER(user)
            window.location.href = '/'
          }
        })
      } catch ({ response }) {
        this.SET_ERROR({ message: response.data })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style lang="scss">
.login-form {
  padding-top: 6em;
}
</style>
