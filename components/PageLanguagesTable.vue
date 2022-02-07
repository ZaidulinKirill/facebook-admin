<template>
  <div>
    <h3 class="mt-5 mb-2">
      Languages
      <!-- <v-btn
        color="primary"
        small
        depressed
        class="ml-4"
        :disabled="isNewItemDialogOpened"
        @click="selectedItemId = null; isNewItemDialogOpened = true;"
      >
        <v-icon class="mr-2">
          add
        </v-icon> New page variant
      </v-btn> -->
    </h3>
    <hasura-table
      source="PageLanguage"
      :fields="headers"
      :filters="{ pageId: { _eq: pageId } }"
      :disabled="disabled || !pageId"
      sort-by="created_at"
      sort-desc
      :skeleton-rows-count="3"
      :footer-props="{ itemsPerPageOptions: [5, 20, 40] }"
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
      <template #[`item.clone`]="{item}">
        <v-btn
          icon
          @click="selectedItemId = item.id; isNewItemDialogOpened = true;"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
      </template>
    </hasura-table>

    <v-dialog
      v-model="isNewItemDialogOpened"
      max-width="600"
      persistent
    >
      <hasura-form
        v-if="isNewItemDialogOpened"
        ref="form"
        source="PageLanguage"
        :fields="fields"
        :item-id="selectedItemId"
        :mutation="createVariant"
        :value="defaultValue"
        @submit="onSubmit"
      >
        <template #title>
          {{ selectedItemId ? 'Clone to': 'Edit' }}
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
  </div>
</template>
<script>
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import { mapMutations, mapActions } from 'vuex'
import { gql } from 'graphql-tag'

export default {
  components: {
    HasuraTable,
    HasuraForm
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
    $subscribe: {
      page: {
        query: gql`subscription GetPage($id: uuid!) {
          Page_by_pk(id: $id) {
            id
            siteId
          }
        }`,
        variables () {
          return {
            id: this.pageId
          }
        },
        result ({ data }) {
          this.page = data.Page_by_pk
        },
        skip () {
          return !this.pageId
        }
      }
    }
  },
  data () {
    return {
      selectedItemId: null,
      page: null,
      isNewItemDialogOpened: false,
      headers: [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Language', value: 'language { id *name* }' },
        { text: 'Template', value: 'template { id *name* }' },
        { text: 'Clone', value: 'clone', selectable: false, sortable: false, width: 64 },
        { text: 'Created', value: 'created_at', type: 'date', width: 100 }
      ],
      fields: [
        {
          label: 'Template',
          value: 'templateId',
          type: 'remote',
          query: 'Template { id name }',
          itemText: 'name',
          itemValue: 'id',
          required: true,
          disabled: () => !!this.selectedItemId
        },
        {
          label: 'Language',
          value: 'languageId',
          type: 'remote',
          query: 'Language { id name }',
          itemText: 'name',
          itemValue: 'id',
          required: true,
          fetchAll: true,
          filter: () => ({
            sites: { siteId: { _eq: this.page.siteId } }
          })
        }
      ]
    }
  },
  computed: {
    defaultValue () {
      return {
        pageId: this.pageId
      }
    }
  },
  methods: {
    ...mapMutations(['SET_ERROR']),
    ...mapActions(['refreshCache']),
    async createVariant ({ item }) {
      const { data: { PageVariant_aggregate: { aggregate: { count } } } } = await this.$apollo.query({
        query: gql`query Find($where: PageVariant_bool_exp!) {
          PageVariant_aggregate(where: $where) {
            aggregate { count }
          }
        }`,
        variables: {
          where: {
            pageId: { _eq: this.pageId },
            languageId: { _eq: item.languageId }
          }
        }
      })

      if (count > 0) {
        throw new Error('Variant is already exist!')
      }

      let variablesToCopy = null
      if (this.selectedItemId) {
        const { data: { PageLanguage: [{ variables }] } } = await this.$apollo.query({
          query: gql`query Find($where: PageVariant_bool_exp!) {
            PageLanguage(where: $where) {
              id
              variables
            }
          }`,
          variables: {
            where: {
              id: { _eq: this.selectedItemId }
            }
          }
        })

        variablesToCopy = variables
      }

      delete item.id

      const { data: { insert_PageVariant_one: createdItem } } = await this.$apollo.mutate({
        mutation: gql`mutation Insert($item: PageVariant_insert_input!) {
          insert_PageVariant_one(object: $item) {
            id
          }
        }`,
        variables: {
          item: {
            ...item,
            ...variablesToCopy && {
              variables: variablesToCopy
            }
          }
        }
      })

      this.selectedItemId = createdItem.id
      return createdItem
    },
    openItem (itemId) {
      this.$nuxt.$router.push(`/page-languages/${itemId}`)
    },
    onSubmit ({ item }) {
      this.refreshCache()
      this.isNewItemDialogOpened = false

      this.openItem(this.selectedItemId || item.id)
    }
  }
}
</script>
