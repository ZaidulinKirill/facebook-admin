<template>
  <div>
    <h3 class="mt-5 mb-2">
      Modules
      <v-btn
        color="primary"
        small
        depressed
        class="ml-4"
        :disabled="isNewItemDialogOpened"
        @click="isNewItemDialogOpened = true"
      >
        <v-icon class="mr-2">
          add
        </v-icon> New module
      </v-btn>
    </h3>
    <hasura-table
      ref="table"
      source="PageModule"
      :fields="headers"
      :filters="{ pageId: { _eq: pageId } }"
      :disabled="disabled || !pageId"
      sort-by="sort"
      sort-asc
      :default-selections="defaultSelections"
      :skeleton-rows-count="3"
      hide-default-footer
      :items-per-page="-1"
      :delete-params="{ isRowEnabled: isDeletionEnabled }"
      :footer-props="{ itemsPerPageOptions: [30, 50, 100] }"
      @opened="openItem($event)"
    >
      <template #[`body`]="{items}">
        <draggable
          :list="items"
          tag="tbody"
          handle=".handle"
          filter=".lock"
          draggable=".item"
          ghost-class=".ghost-preview"
          @change="onOrderChanged"
        >
          <tr
            v-for="(item, index) in items"
            :key="index"
            :class="index === 0 ? 'lock' : 'item'"
          >
            <td>
              <v-btn icon class="handle" style="cursor: move;">
                <v-icon>mdi-drag-horizontal</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                icon
                @click="openItem(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
            <td>
              {{ item.name || item.module.name }}
            </td>
            <td> {{ !item.startDate ? '*' : $moment(item.startDate).format('DD/MM/YYYY HH:mm') }} </td>
            <td> {{ !item.endDate ? '*' : $moment(item.endDate).format('DD/MM/YYYY HH:mm') }} </td>
            <td>
              <v-tooltip v-if="item.module.systemType === 'form'" bottom>
                <template #activator="{on: on}">
                  <v-btn
                    icon
                    v-on="on"
                    @click="openOrdersPage(item)"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
                Open Entries
              </v-tooltip>
            </td>
            <td>
              <v-checkbox
                hide-details
                :input-value="item.isEnabled"
                dense
                class="mt-0"
                :disabled="enabledMap[item.id] || item.module.systemType === 'head'"
                @change="toggleIsEnabled(item)"
              />
            </td>
            <td>
              <v-btn :disabled="index === 0" icon small @click="duplicateModule(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                icon
                :disabled="index === 0"
                @click="isConfirmationDialogOpened = true; selectedModule = item"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </draggable>
      </template>
    </hasura-table>

    <v-dialog
      v-model="isNewItemDialogOpened"
      max-width="900"
      persistent
      scrollable
    >
      <hasura-form
        v-if="isNewItemDialogOpened"
        ref="form"
        source="PageModule"
        :fields="fields"
        :value="defaultItem"
        @submit="onSubmit"
      >
        <template #[`field.line`]="{}">
          <div style="border-bottom: thin solid #2A3042" class="mt-5 mb-5" />
        </template>
        <template #[`field.moduleId`]="{item, $input}">
          <h3 class="mb-3">
            Modules library
          </h3>
          <modules-library :tag="item.tag" :value="item.moduleId" class="mb-4" @input="$input('moduleId', $event)" />
        </template>
        <template #actions="{isNew, isSaving, submit}">
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="isNewItemDialogOpened = false">
              Cancel
            </v-btn>
            <v-btn color="primary" :loading="isSaving" @click="submit">
              {{ isNew ? 'Save' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </template>
      </hasura-form>
    </v-dialog>

    <v-dialog
      v-model="isEditItemDialogOpened"
      :max-width="editDialogWidth"
      persistent
      :scrollable="isEditDialogScrollable"
      :retain-focus="false"
    >
      <page-module-edit-form
        v-if="isEditItemDialogOpened"
        modal
        :title="`Edit ${selectedToEditItem.module.name}`"
        :page-module-id="selectedToEditItem.id"
        @close="isEditItemDialogOpened = false"
        @submit="isEditItemDialogOpened = false; refreshCache()"
      />
    </v-dialog>

    <confirmation-dialog
      v-model="isConfirmationDialogOpened"
      @confirm="deleteModule"
      @decline="isConfirmationDialogOpened = false"
    />
  </div>
</template>
<script>
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import { mapActions } from 'vuex'
import { gql } from 'graphql-tag'
import draggable from 'vuedraggable'
import ConfirmationDialog from 'vuetify-schema-form/src/components/ConfirmationDialog'
import ModulesLibrary from '~/components/ModulesLibrary'
import PageModuleEditForm from '~/components/PageModuleEditForm'

export default {
  components: {
    HasuraTable,
    HasuraForm,
    ModulesLibrary,
    PageModuleEditForm,
    draggable,
    ConfirmationDialog
  },
  props: {
    pageId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    modules: {
      query: gql`{
        modules: Module {
          id
          tag
        }
      }`
    },
    $subscribe: {
      modulesCount: {
        query: gql`subscription GetCount($itemId: uuid!) {
          PageModule_aggregate(where: { module: {
            _or: [{ systemType: { _neq: "head" } }, { systemType: { _is_null: true } }]
          }, pageId: { _eq: $itemId } }) {
            aggregate {
              count
            }
          }
        }`,
        variables () {
          return {
            itemId: this.pageId
          }
        },
        result ({ data }) {
          this.modulesCount = data.PageModule_aggregate.aggregate.count
        },
        skip () {
          return !this.pageId
        }
      }
    }
  },
  data () {
    return {
      isConfirmationDialogOpened: false,
      modules: [],
      isEditItemDialogOpened: false,
      editDialogWidth: 800,
      isEditDialogScrollable: false,
      selectedToEditItem: null,
      selectedModule: null,
      languages: [],
      isSortSaving: false,
      sortLoadingMap: {},
      modulesCount: 0,
      enabledMap: {},
      isNewItemDialogOpened: false,
      defaultSelections: 'id sort page { id siteId } moduleLanguages { id language { id name } } module { id name openOnNewPage dialogWidth systemType isEditDialogScrollable  }',
      headers: [
        { text: '', value: 'sort', width: 24, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 }, sortable: false },
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Module', value: 'name', selector: 'name module { id *name*  }', sortable: false },
        { text: 'Active from', value: 'startDate' },
        { text: 'Active until', value: 'endDate' },
        { text: 'Action', value: 'action', width: 24, selectable: false, sortable: false },
        { text: 'Enable', value: 'isEnabled', width: 24, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 }, sortable: false },
        { text: 'Clone', value: 'duplicate', sortable: false, width: 24, selectable: false },
        { text: 'Delete', value: 'delete', sortable: false, width: 24, selectable: false }
      ],
      fields: [
        { label: 'Filter by tag', value: 'tag', type: 'autocomplete', md: 6, items: () => Object.values(this.modules.reduce((acc, item) => { acc[item.tag] = item; return acc }, {})), itemText: 'tag', itemValue: 'tag', clearable: true, selectable: false, editable: false },
        {
          label: 'Module',
          value: 'moduleId',
          required: true
        },
        {
          value: 'line',
          editable: false,
          selectable: false,
          md: 12,
          if: ({ item }) => item && item.module && item.module.systemType !== 'head'
        },
        { label: 'Name', value: 'name', md: 4 },
        { label: 'Active from', value: 'startDate', type: 'datetime', md: 4 },
        { label: 'Active until', value: 'endDate', type: 'datetime', md: 4 }
      ]
    }
  },
  computed: {
    defaultItem () {
      return {
        pageId: this.pageId,
        sort: this.modulesCount + 1
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    async duplicateModule (item) {
      const { data: { module } } = await this.$apollo.query({
        query: gql`query Get($id: uuid!) {
          module: PageModule_by_pk(id: $id) {
            id pageId moduleId startDate endDate created_at isRemoved isEnabled variables name sort
          }
        }`,
        variables: {
          id: item.id
        }
      })

      delete module.__typename
      delete module.id

      await this.$apollo.mutate({
        mutation: gql`mutation Insert($item: PageModule_insert_input!) {
          insert_PageModule_one(object: $item) {
            id
          }
        }`,
        variables: {
          item: module
        }
      })

      this.refreshCache()
    },
    async deleteModule () {
      const moduleId = this.selectedModule.id

      await this.$apollo.mutate({
        mutation: gql`mutation Delete($moduleId: uuid!) {
          update_PageModule_by_pk(pk_columns: { id: $moduleId }, _set: {isRemoved: true}) {
            id
          }
        }`,
        variables: {
          moduleId
        }
      })

      this.isConfirmationDialogOpened = false
      this.refreshCache()

      return { id: moduleId }
    },
    async onOrderChanged ({ moved }) {
      const items = [...this.$refs.table.items]
      const [element] = items.splice(moved.oldIndex, 1)

      const getSort = (prevItem, nextItem) => {
        if (!prevItem && nextItem) {
          return nextItem.sort - 1
        }

        if (prevItem && !nextItem) {
          return prevItem.sort + 1
        }

        if (prevItem && nextItem) {
          return (nextItem.sort + prevItem.sort) / 2
        }

        return 1
      }

      const newSort = getSort(items[moved.newIndex - 1], items[moved.newIndex])

      await this.$apollo.mutate({
        mutation: gql`mutation UpdateSort($where: PageModule_bool_exp!, $sort: Float!) {
          update_PageModule(where: $where, _set: { sort: $sort }) {
            affected_rows
          }
        }`,
        variables: {
          where: {
            id: { _eq: element.id }
          },
          sort: newSort
        }
      })

      this.$refs.table.$apollo.queries.items.refetch()
    },
    openOrdersPage (item) {
      this.$nuxt.$router.push(`/entries?siteId=${item.page.siteId}&pageModuleId=${item.id}`)
    },
    isDeletionEnabled (row) {
      return row.module.systemType !== 'head'
    },
    openItem (pageModule) {
      this.isEditItemDialogOpened = true
      this.editDialogWidth = pageModule.module.dialogWidth
      this.isEditDialogScrollable = pageModule.module.isEditDialogScrollable
      this.selectedToEditItem = pageModule
    },
    async toggleIsEnabled (item) {
      this.$set(this.enabledMap, item.id, true)

      await this.$apollo.mutate({
        mutation: gql`mutation SetDefault($id: uuid!, $value: Boolean!) {
          update_PageModule_by_pk(pk_columns: { id: $id }, _set: { isEnabled: $value }) {
            id
          }
        }`,
        variables: {
          id: item.id,
          value: !item.isEnabled
        }
      })

      this.refreshCache()

      await new Promise(resolve => setTimeout(resolve, 500))
      this.$set(this.enabledMap, item.id, false)
    },
    onSubmit () {
      this.refreshCache()
      this.isNewItemDialogOpened = false
    }
  }

}
</script>
