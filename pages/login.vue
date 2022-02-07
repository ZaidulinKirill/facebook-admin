<template>
  <v-row class="login-form fill-height">
    <v-col cols="12">
      <v-row justify="center">
        <v-col cols="12" class="d-flex justify-center">
          <div style="width: 100%; max-width: 500px;">
            <v-card class="elevation-5">
              <v-sheet color="toolbar">
                <login-form-title title="Login" />
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
                <div class="d-flex align-center mb-5" style="margin-top: -20px;">
                  <v-spacer />
                  <v-btn
                    x-small
                    class="px-1"
                    text
                    @click="forgotPassword"
                  >
                    <u>Forgot your password?</u>
                  </v-btn>
                </div>
                <v-btn
                  block
                  color="primary"
                  dark
                  :loading="loading"
                  @click="$refs.form.submit()"
                >
                  Login
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-col>
    <v-dialog v-model="isPasswordRecoveryDialogOpened" persistent max-width="400">
      <v-card v-if="isPasswordRecoveryDialogOpened">
        <v-card-text class="py-4">
          <v-row no-gutters>
            <v-col cols="12">
              <schema-form
                ref="recovery"
                v-model="recoveryData"
                :fields="passwordRecoveryFields"
                class="login-fields mt-3"
                submit-on-enter
                @submit="startRecovery"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="mt-0 pt-0">
          <v-spacer />
          <v-btn color="primary" @click="isPasswordRecoveryDialogOpened = false">
            Cancel
          </v-btn>
          <v-btn color="primary" :loading="isSaving" @click="$refs.recovery.submit()">
            Next
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapMutations } from 'vuex'
import { SchemaForm } from 'vuetify-schema-form'
import LoginFormTitle from '~/components/LoginFormTitle'

export default {
  name: 'Login',
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
      step: 'login',
      loading: false,
      isSaving: false,
      isPasswordRecoveryDialogOpened: false,
      isRecoveryMessageSentDialogOpened: false
    }
  },
  computed: {
    fields () {
      return [
        {
          label: 'E-mail',
          value: 'email',
          type: 'email',
          placeholder: 'login@example.com',
          required: true,
          prependIcon: 'mdi-badge-account-horizontal-outline',
          autofocus: true
        },
        {
          label: 'Password',
          value: 'password',
          type: 'password',
          required: true,
          prependIcon: 'mdi-lock'
        }
      ]
    },
    passwordRecoveryFields () {
      return [
        {
          label: 'Email',
          value: 'email',
          type: 'email',
          placeholder: 'login@example.com',
          required: true,
          prependIcon: 'mdi-badge-account-horizontal-outline',
          autofocus: true
        }
      ]
    }
  },
  mounted () {
    this.SET_USER(null)
  },
  methods: {
    ...mapMutations(['SET_ERROR', 'SET_ALERT']),
    ...mapMutations('auth', ['SET_USER']),
    forgotPassword () {
      this.recoveryData.email = this.item.email
      this.isPasswordRecoveryDialogOpened = true
    },
    startRecovery (item) {
      this.isSaving = true
      setTimeout(async () => {
        await this.$axios.post('/api/auth/password-recovery', {
          email: item.email
        })

        this.isSaving = false
        this.isPasswordRecoveryDialogOpened = false

        this.SET_ALERT({
          message: 'The instructions to reset your password have been sent to your email address. If you can\'t find it right away, check your junk mail.',
          actionText: 'OK',
          action: () => {}
        })
      }, 500)
    },
    async submit () {
      if (this.isPasswordRecoveryDialogOpened) {
        return
      }

      const inputs = [...this.$refs.form.$el.querySelectorAll('input')]

      this.loading = true
      try {
        switch (this.step) {
        case 'email': {
          this.step = 'login'
          break
        }
        case 'login': {
          const user = await this.$axios.$post('/api/auth/login', {
            email: (inputs[0].value || '').toLowerCase(),
            password: inputs[1].value
          })

          this.SET_USER(user)
          window.location.href = '/'
        }
        }
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
