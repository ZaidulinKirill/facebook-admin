<template>
  <v-row class="fill-height " no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <site-languages-table :site-id="user.siteId" statistics />
        </v-card-text>
        <v-card-title>
          Entries
        </v-card-title>
        <v-card-text>
          <div v-for="(form, formIdx) in forms" :key="form.id" class="mt-2 pb-5">
            <site-orders-table :site-id="user.siteId" :page-module-id="form.id" :title="form.name || `Form #${formIdx+1}`" />
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { gql } from 'graphql-tag'
import SiteOrdersTable from '~/components/SiteOrdersTable'
import SiteLanguagesTable from '~/components/SiteLanguagesTable'

export default {
  apollo: {
    site: {
      query: gql`query Get($id: uuid!) {
        site: Site_by_pk(id: $id) {
          id
          pages {
            id
            modules {
              id
              variables
              name
              module {
                id
                variables
                systemType
              }
            }
          }
        }
      }`,
      variables () {
        return {
          id: this.user.siteId
        }
      },
      skip () {
        return false
      }
    }
  },
  components: {
    SiteOrdersTable,
    SiteLanguagesTable
  },
  data () {
    return {
      site: null
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    forms () {
      if (!this.site) {
        return []
      }

      return this.site.pages
        .map(
          page => page.modules.map(module => ({
            ...module.module,
            id: module.id,
            name: module.name,
            variables: module.variables
          }))
        )
        .flat()
        .filter(x => x.systemType === 'form')
    }
  }
}
</script>
