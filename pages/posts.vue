<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Posts
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by user"
          />
        </v-card-title>
        <v-card-text>
          <hasura-table
            source="Post"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            @opened="isEditItemDialogOpened = true;selectedItem = $event"
          >
            <template #[`item.user`]="{item}">
              {{ item.user ? `${item.user.name} ${item.user.lastName}`.trim() : '[no value]' }}
            </template>
            <template #[`item.data`]="{item}">
              {{ item.data ? item.data.description : '' }}
            </template>
            <template #[`item.challengeId`]="{item}">
              {{ challenges ? (challenges.find(x => x.id === item.challengeId) || {}).name : '' }}
            </template>
            <template #[`item.content`]="{item}">
              <a v-if="item.type === 'image'" :href="`/api/uploads/${(item.data || {}).photo}`" target="_blank">
                <img :src="`/api/uploads/w_130,h_130/${(item.data || {}).photo}`">
              </a>
              <video
                v-if="item.type === 'video'"
                :src="`/api/uploads/${(item.data || {}).video}?range=true#t=0.5`"
                width="130"
                height="130"
                style="background-color: black;"
                controls
              />
              <audio
                v-if="item.type === 'audio'"
                :src="`/api/uploads/${(item.data || {}).audio}?range=true`"
                width="130"
                controls
              />
            </template>
            <template #[`item.comments`]="{item}">
              <v-btn
                text
                small
                @click="isEditItemDialogOpened = true;selectedItem = item"
              >
                <v-icon small class="mr-1">
                  mdi-pencil
                </v-icon>
                comments
              </v-btn>
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
        source="Post"
        :item-id="selectedItem.id"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #[`title`]="{}" />
        <template #[`field.comments`]="{}">
          <hasura-table
            source="Message"
            :fields="messageHeaders"
            :filters="{postId: {_eq: selectedItem.id}}"
            sort-by="created_at"
            sort-desc
            :items-per-page="10"
            :footer-props="{ itemsPerPageOptions: [10, 50, 100] }"
          >
            <template #[`item.user`]="{item}">
              {{ item.user ? `${item.user.name} ${item.user.lastName}`.trim() : '[no value]' }}
            </template>
          </hasura-table>
        </template>
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
      sites: null,
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
    fields () {
      return [
        { value: 'comments', selectable: false, editable: false }
      ]
    },
    headers () {
      return [
        { text: 'Date', value: 'created_at', type: 'datetime' },
        { text: 'Challenge', value: 'challengeId', sortable: false },
        { text: 'User', value: 'user', selector: 'user {id name lastName}' },
        { text: 'Type', value: 'type' },
        { text: 'Description', value: 'data', sortable: false },
        { text: 'Content', value: 'content', sortable: false, selectable: false },
        { text: '', value: 'comments', selector: 'messages_aggregate { aggregate { count } }', sortable: false }
      ]
    },
    messageHeaders () {
      return [
        { text: 'Date', value: 'created_at', type: 'datetime' },
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
