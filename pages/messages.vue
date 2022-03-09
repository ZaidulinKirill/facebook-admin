<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Comments
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
            @opened="isEditItemDialogOpened = true;selectedItem = $event"
          >
            <template #[`item.edit`]="{item}">
              <v-btn
                icon
                @click="isEditItemDialogOpened = true;selectedItem = item"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
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
    <v-dialog
      v-model="isEditItemDialogOpened"
      max-width="900"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      persistent
    >
      <hasura-form
        v-if="isEditItemDialogOpened"
        ref="form"
        :value="defaultItem"
        source="Message"
        :item-id="selectedItem.id"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #[`title`]="{}" />
        <template #actions="{isNew, isSaving, submit}">
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="isEditItemDialogOpened = false">
              Cancel
            </v-btn>
            <v-btn color="primary" :loading="isSaving" @click="submit">
              {{ isNew ? 'Save' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </template>
      </hasura-form>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import { gql } from 'graphql-tag'

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm
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
      selectedItem: {},
      fields: [
        { label: 'Text', value: 'text', type: 'textArea', rows: 3, outlined: true, required: true }
      ]
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
        { text: 'Edit', value: 'edit', sortable: false, width: 24, selectable: false },
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
