import Vue from 'vue'
import VuetifyHasuraTable from 'vuetify-hasura-table'
import { SchemaTable } from 'vuetify-schema-table'

export default ({ store }) => {
  Vue.use(VuetifyHasuraTable, {
    table: SchemaTable,
    errorHandler (error) {
      store.commit('SET_ERROR', { message: error })
    }
  })
}
