<template>
  <v-row class="login-form fill-height">
    <v-col cols="12">
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center">
          <div style="width: 100%; max-width: 500px;">
            <v-card class="elevation-5">
              <v-sheet color="toolbar">
                <login-form-title title="Password recovery" />
              </v-sheet>
              <v-card-text class="py-4">
                <v-row no-gutters>
                  <v-col cols="12">
                    <schema-form
                      ref="form"
                      v-model="item"
                      :fields="fields"
                      class="login-fields mt-3 mb-1"
                      submit-on-enter
                      @submit="submit"
                    />
                  </v-col>
                </v-row>
                <v-btn
                  block
                  color="primary"
                  dark
                  :loading="loading"
                  @click="$refs.form.submit()"
                >
                  Confirm
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
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
  name: 'PasswordRecovery',
  layout: 'plain',
  components: {
    SchemaForm,
    LoginFormTitle
  },
  meta: {
    public: true
  },
  data () {
    return {
      item: {},
      recoveryData: {},
      loading: false
    }
  },
  computed: {
    fields () {
      return [
        {
          label: 'Current password',
          value: 'password',
          type: 'password',
          required: true
        },
        {
          label: 'New password',
          value: 'passwordConfirm',
          type: 'password',
          required: true,
          rules: [(val) => {
            return !this.item.password || this.item.password === val || 'Passwords are not equal'
          }]
        }
      ]
    }
  },
  methods: {
    ...mapMutations(['SET_ERROR', 'SET_ALERT']),
    ...mapMutations('auth', ['SET_USER']),
    async submit () {
      const inputs = [...this.$refs.form.$el.querySelectorAll('input')]

      this.loading = true
      try {
        await this.$axios.$post('/api/auth/password-recovery-confirm', {
          userId: this.$route.query.user,
          password: inputs[0].value
        })

        this.SET_ALERT({
          message: 'Password has been successfully changed',
          actionText: 'Login',
          action: () => {
            this.$nuxt.$router.push('/login')
          }
        })
      } catch ({ response }) {
        this.SET_ERROR({ message: response.data })
        this.loading = false
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
<style>
/* Chrome, Safari, Edge, Opera */
.login-fields input::-webkit-outer-spin-button,
.login-fields input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.login-fields input[type="number"] {
  -moz-appearance: textfield;
}
</style>
