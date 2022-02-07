<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center mb-0 pb-0">
          Users
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by name or email"
          >
            <template #prepend-inner>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-tooltip left>
                    <template #activator="{on: tooltipOn}">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="{...on, ...tooltipOn}"
                      >
                        <v-icon>mdi-filter-plus</v-icon>
                      </v-btn>
                    </template>
                    Add filter
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in filterOptions"
                    :key="index"
                    @click="selectedFilters.push(item)"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </v-card-title>
        <v-card-title class="my-0">
          <v-row>
            <v-col v-for="(filter, i) in selectedFilters" :key="i" cols="auto">
              <selected-filter-option v-model="selectedFilters[i]" @remove="selectedFilters.splice(i, 1)" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <hasura-table
            source="User"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            default-selections="id lastSignInDate"
            @opened="isEditItemDialogOpened = true;selectedItem = $event"
          >
            <template #[`item.name`]="{item}">
              <div class="d-flex align-center" style="white-space: pre;">
                <div class="recording-state elevation-1" :class="{isRecording: item.lastSignInDate && $moment(item.lastSignInDate) > $moment().add(-3, 'days')}" />
                <b class="ml-2" style="margin-top: 1px;">{{ item.name }}</b>
              </div>
            </template>
            <template #[`item.edit`]="{item}">
              <v-btn
                icon
                @click="isEditItemDialogOpened = true;selectedItem = item"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>

            <template #add-button="{onClick}">
              <fab-button tooltip="Create" @click="onClick" />
            </template>
          </hasura-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog
      v-model="isEditItemDialogOpened"
      max-width="600"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      persistent
    >
      <hasura-form
        v-if="isEditItemDialogOpened"
        ref="form"
        :value="defaultItem"
        source="User"
        :custom-selections="items => items.filter(x => x !== 'password')"
        :mutation="submitItem"
        :item-id="selectedItem.id"
        :fields="fields"
        @submit="onSubmit"
      >
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
    <fab-button tooltip="Create" @click="isEditItemDialogOpened = true; selectedItem = {}" />
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import { Roles, RolesList } from '../constants'
import FabButton from '~/components/FabButton'
import SelectedFilterOption from '~/components/SelectedFilterOption'

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm,
    FabButton,
    SelectedFilterOption
  },
  data () {
    return {
      isSnackbarShown: false,
      selectedFilters: [],
      search: '',
      isEditItemDialogOpened: false,
      selectedItem: {},
      filterOptions: [
        { name: 'Role', value: 'role', items: RolesList }
      ]
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    defaultItem () {
      return { role: 'admin' }
    },
    fields () {
      return [
        { label: 'Name', value: 'name', md: 6, required: true },
        { label: 'E-mail', value: 'email', type: 'email', md: 6, required: true },
        { label: 'Role', value: 'role', type: 'select', items: RolesList, md: 6, required: true },
        {
          label: 'Password',
          value: 'password',
          required: ({ isNew }) => isNew,
          placeholder: ({ isNew }) => !isNew ? 'Enter value to change password' : null,
          type: 'password',
          md: 6
        },
        {
          label: 'Site',
          value: 'siteId',
          type: 'remote',
          query: 'Site { id subdomain }',
          itemText: 'subdomain',
          itemValue: 'id',
          if: ({ item }) => item.role === Roles.CLIENT,
          md: 12,
          required: true
        }
      ]
    },
    headers () {
      return [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Name', value: 'name' },
        { text: 'E-mail', value: 'email', type: 'email' },
        { text: 'Site', value: 'site { id *subdomain* }' },
        { text: 'Role', value: 'role', type: 'select', items: RolesList },
        { text: 'Last activity', value: 'lastSignInDate', type: 'date' },
        { text: 'Created', value: 'created_at', type: 'date' }
      ]
    },
    allFilters () {
      return {
        _and: [
          Object.assign({}, ...this.selectedFilters
            .filter(filter => filter.selected)
            .map(filter => filter.resolver
              ? filter.resolver(filter.selected)
              : ({ [filter.value]: { [filter.filter || (filter.type === 'select' ? '_eq' : '_in')]: filter.selected } }))),
          this.search.length && {
            _or: [
              { name: { _ilike: `%${this.search}%` } },
              { email: { _ilike: `%${this.search}%` } }
            ]
          }
        ].filter(x => !!x)
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    submitItem ({ item, isNew }) {
      const inputs = [...this.$refs.form.$el.querySelectorAll('input')]

      const actualItem = {
        ...item,
        email: (item.email || '').toLowerCase(),
        password: inputs[4].value
      }

      if (isNew) {
        return this.$axios.$post('/api/users', actualItem)
      } else {
        return this.$axios.$put('/api/users', actualItem)
      }
    },
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
