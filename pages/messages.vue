<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Messages
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by user or text"
          />
        </v-card-title>
        <v-card-text>
          <hasura-table
            source="Message"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            :items-per-page="50"
            :footer-props="{ itemsPerPageOptions: [50, 100, 100, 200, -1] }"
          >
            <template #[`item.user`]="{item}">
              {{ item.user ? `${item.user.name} ${item.user.lastName}`.trim() : '[no value]' }}
            </template>
            <template #[`item.challengeId`]="{item}">
              {{ challenges && item.post ? (challenges.find(x => x.id === item.post.challengeId) || {}).name : '' }}
            </template>
          </hasura-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HasuraTable } from 'vuetify-hasura-table'
import { gql } from 'graphql-tag'

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable
  },
  apollo: {
    sites: {
      query: gql`{
        sites: Site {
          id
          languages {
            isDefault
            languageId
          }
          pages {
            id
            modules (where: {systemType: {_eq: "challenges"}}) {
              id
              variables
            }
          }
        }
      }`
    }
  },
  data () {
    return {
      selectedFilters: [],
      search: '',
      isEditItemDialogOpened: false,
      selectedItem: {}
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    defaultLanguage () {
      if (!this.sites) {
        return []
      }

      return this.sites[0].languages.find(x => x.isDefault)
    },
    challenges () {
      if (!this.sites || !this.defaultLanguage) {
        return []
      }

      return this.sites[0].pages[0].modules[0].variables.challenges.map(challenge => ({
        id: challenge.id,
        name: challenge[`name_${this.defaultLanguage.languageId}`]
      }))
    },
    defaultItem () {
      return { }
    },
    headers () {
      return [
        { text: 'Date', value: 'created_at', type: 'datetime' },
        { text: 'Challenge', value: 'challengeId', selector: 'post {id challengeId}', sortable: false },
        { text: 'User', value: 'user', selector: 'user {id name lastName}' },
        { text: 'Text', value: 'text' }
      ]
    },
    allFilters () {
      return {
        _and: [
          this.search.length && {
            _or: [
              {
                user: {
                  _or: [
                    { name: { _ilike: `%${this.search}%` } },
                    { lastName: { _ilike: `%${this.search}%` } }
                  ]
                }
              },
              {
                text: { _ilike: `%${this.search}%` }
              }
            ]
          }
        ].filter(x => !!x)
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    onSubmit () {
      this.isEditItemDialogOpened = false
      this.refreshCache()
    }
  },
  beforeRouteLeave (to, from, next) {
    const keepState = false
    if (!keepState) {
      this.$destroy()
    }

    next()
  }
}
</script>
