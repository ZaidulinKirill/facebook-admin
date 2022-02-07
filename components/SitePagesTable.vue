<template>
  <div>
    <h3 class="mt-5 mb-2">
      Pages
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
        </v-icon> New page
      </v-btn>
    </h3>
    <hasura-table
      source="Page"
      :fields="headers"
      :filters="{ siteId: { _eq: siteId } }"
      :disabled="disabled || !siteId"
      sort-by="created_at"
      sort-desc
      default-selections="id type"
      :delete-params="{isRowEnabled: isDeletionEnabled}"
      :skeleton-rows-count="3"
      :footer-props="{ itemsPerPageOptions: [10, 20, 40] }"
      @opened="openPage($event.id)"
    >
      <template #[`item.startDate`]="{item}">
        {{ !item.startDate ? '*' : $moment(item.startDate).format('DD/MM/YYYY HH:mm') }}
      </template>
      <template #[`item.endDate`]="{item}">
        {{ !item.endDate ? '*' : $moment(item.endDate).format('DD/MM/YYYY HH:mm') }}
      </template>
      <template #[`item.edit`]="{item}">
        <v-btn
          icon
          @click="openPage(item.id)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
    </hasura-table>

    <v-dialog
      v-model="isNewItemDialogOpened"
      max-width="1300"
      persistent
    >
      <hasura-form
        v-if="isNewItemDialogOpened"
        ref="form"
        source="Page"
        :fields="fields"
        :value="defaultValue"
        @submit="onSubmit"
      >
        <template #[`field.templateId`]="{item, $input}">
          <h3 class="mb-3">
            Templates
          </h3>
          <templates-grid :tag="item.tag" :value="item.templateId" @input="$input('templateId', $event)" />
        </template>
        <!-- <template #[`field.startDate`]="{item, $input}">

        </template> -->
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
import { mapActions } from 'vuex'
import { gql } from 'graphql-tag'
import TemplatesGrid from '~/components/TemplatesGrid'

export default {
  apollo: {
    tags: {
      query: gql`query GetItems($where: Template_bool_exp) {
        tags: Template(where: $where) {
          id
          tag
        }
      }`,
      variables () {
        return {
          where: {
            tag: { _is_null: false }
          }
        }
      }
    }
  },
  components: {
    HasuraTable,
    HasuraForm,
    TemplatesGrid
  },
  props: {
    siteId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tags: [],
      isNewItemDialogOpened: false,
      headers: [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Slug', value: 'slug' },
        { text: 'Template', value: 'template {id *name*}' },
        { text: 'Variants', value: 'variants_aggregate { aggregate { *count* } }' },
        { text: 'Active from', value: 'startDate' },
        { text: 'Active until', value: 'endDate' },
        { text: 'Created', value: 'created_at', type: 'date', width: 100 }
      ],
      fields: [
        { label: 'Slug', value: 'slug', required: true, md: 6 },
        { label: 'Active from', value: 'startDate', type: 'datetime', menuProps: { offsetOverflow: true }, md: 3 },
        { label: 'Active until', value: 'endDate', type: 'datetime', menuProps: { offsetOverflow: true }, md: 3 },
        { label: 'Filter by tag', value: 'tag', type: 'autocomplete', items: () => this.tags, itemText: 'tag', itemValue: 'tag', clearable: true, selectable: false, editable: false, md: 4 },
        {
          label: 'Template',
          value: 'templateId',
          type: 'remote',
          query: 'Template { id name }',
          itemText: 'name',
          itemValue: 'id',
          required: true
        }
      ]
    }
  },
  computed: {
    defaultValue () {
      return {
        slug: 'index',
        siteId: this.siteId
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    isDeletionEnabled (row) {
      return !row.type
    },
    openPage (pageId) {
      this.$nuxt.$router.push(`/pages/${pageId}`)
    },
    onSubmit () {
      this.refreshCache()

      this.isNewItemDialogOpened = false
    }
  }

}
</script>
