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

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm
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
        { text: 'User', value: 'user', selector: 'user {id name lastName}' },
        { text: 'Description', value: 'data', sortable: false },
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
