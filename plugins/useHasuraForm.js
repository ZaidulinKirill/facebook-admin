import Vue from 'vue'
import VuetifyHasuraForm from 'vuetify-hasura-form'
import { SchemaForm } from 'vuetify-schema-form'
import VuetifyConfirm from 'vuetify-confirm'
import Clipboard from 'v-clipboard'

export default ({ store, app }) => {
  Vue.use(VuetifyConfirm, { vuetify: app.vuetify })
  Vue.use(Clipboard)
  Vue.use(VuetifyHasuraForm, {
    form: SchemaForm,
    errorHandler (error, originalError) {
      if (originalError.response) {
        return store.commit('SET_ERROR', {
          message: (originalError && originalError.response && originalError.response.data) || originalError.message
        })
      }

      store.commit('SET_ERROR', { message: error })
    }
  })
}
