<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Modules
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by name"
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
        <v-card-title v-if="selectedFilters.length" class="my-0">
          <v-row>
            <v-col v-for="(filter, i) in selectedFilters" :key="i" cols="auto">
              <selected-filter-option v-model="selectedFilters[i]" @remove="selectedFilters.splice(i, 1)" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-3">
          <hasura-table
            source="Module"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            @opened="openItem($event.id)"
          >
            <template #[`item.edit`]="{item}">
              <v-btn
                icon
                @click="openItem(item.id)"
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
        :value="defaultItem"
        source="Module"
        :item-id="selectedItem.id"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #title>
          Create a module
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
    <fab-button tooltip="Create" @click="isEditItemDialogOpened = true; selectedItem = {}" />
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
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
      selectedFilters: [],
      search: '',
      isEditItemDialogOpened: false,
      selectedItem: {},
      defaultItem: {
      },
      fields: [
        { label: 'Name', value: 'name', required: true },
        { label: 'Tag', value: 'tag', required: true }
      ],
      headers: [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Name', value: 'name' },
        { text: 'Tag', value: 'tag' },
        { text: 'Created', value: 'created_at', type: 'date' }
      ],
      filterOptions: []
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    allFilters () {
      return {
        _and: [
          Object.assign({}, ...this.selectedFilters
            .filter(filter => filter.selected || filter.selected === false)
            .map(filter => filter.resolver
              ? filter.resolver(filter.selected)
              : ({ [filter.value]: { [filter.filter || (filter.type === 'select' ? '_eq' : '_in')]: filter.selected } }))),
          this.search.length && {
            _or: [
              { name: { _ilike: `%${this.search}%` } }
            ]
          }
        ].filter(x => !!x)
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    openItem (itemId) {
      this.$nuxt.$router.push(`/modules/${itemId}`)
    },
    onSubmit ({ item }) {
      this.isEditItemDialogOpened = false
      this.refreshCache()

      this.openItem(item.id)
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
