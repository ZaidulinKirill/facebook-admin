<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Uploads
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by file name"
          />
        </v-card-title>
        <v-card-text>
          <hasura-table
            source="Upload"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            @opened="isEditItemDialogOpened = true;selectedItem = $event"
          >
            <template #[`item.preview`]="{item}">
              <file-preview :file-id="item.file.id" />
            </template>
            <template #[`item.url`]="{item}">
              <v-btn icon @click="copyLink(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
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
        source="Upload"
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

    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
    >
      Link copied
    </v-snackbar>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import FabButton from '~/components/FabButton'
import FilePreview from '~/components/FilePreview'

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm,
    FabButton,
    FilePreview
  },
  data () {
    return {
      snackbar: false,
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
        { label: 'Drop your file into the area', value: 'fileId', type: 'file' }
      ]
    },
    headers () {
      return [
        { text: 'Filename', value: 'file { id *name* }' },
        { text: 'Preview', value: 'preview', selectable: false, width: 200 },
        { text: 'Link', value: 'url', selector: 'file { id *url* }', width: 32 },
        { text: 'Created', value: 'created_at', type: 'datetime', width: 150 }
      ]
    },
    allFilters () {
      return {
        _and: [
          this.search.length && {
            _or: [
              { file: { name: { _ilike: `%${this.search}%` } } }
            ]
          }
        ].filter(x => !!x)
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    copyLink (item) {
      this.$clipboard(item.file.url)
      this.snackbar = true
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
