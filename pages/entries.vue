<template>
  <v-row class="fill-height no-title" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="mb-0 pb-0">
          <the-breadcrumbs :items="breadcrumbSections" />
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <site-orders-table :site-id="$nuxt.$route.query.siteId" :page-module-id="$nuxt.$route.query.pageModuleId" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { gql } from 'graphql-tag'
import SiteOrdersTable from '~/components/SiteOrdersTable'
import TheBreadcrumbs from '~/components/TheBreadcrumbs'

export default {
  transition (to, from) {
    if (from && from.name === 'sites-id') {
      return 'slide-right'
    }

    return 'slide-left'
  },
  apollo: {
    pageModule: {
      query: gql`query Get($id: uuid!) {
        pageModule: PageModule_by_pk(id: $id) {
          id
          module {id name}
          page {
            id
            site {
              id
              subdomain
            }
          }
        }
      }`,
      variables () {
        return {
          id: this.$nuxt.$route.query.pageModuleId
        }
      },
      skip () {
        return false
      }
    }
  },
  components: {
    SiteOrdersTable,
    TheBreadcrumbs
  },
  data () {
    return {
      pageModule: null
    }
  },
  computed: {
    breadcrumbSections () {
      return [
        { text: 'Sites', to: '/sites', exact: true },
        ...this.pageModule ? [
          { text: this.pageModule.page.site.subdomain, to: `/sites/${this.pageModule.page.site.id}`, exact: true },
          { text: 'Entries', disabled: true }
        ] : []
      ]
    }
  }
}
</script>
