<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Fonts
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by name"
          />
        </v-card-title>
        <v-card-text>
          <hasura-table
            source="Font"
            :fields="headers"
            :filters="allFilters"
            sort-by="name"
            sort-desc
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
        source="Font"
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
import FabButton from '~/components/FabButton'

export default {
  transition (to, from) {
    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm,
    FabButton
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
        { label: 'Font family', value: 'name', required: true },
        { label: 'Google Font url', value: 'url', required: true, placeholder: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap' }
      ]
    },
    headers () {
      return [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Font family', value: 'name' },
        { text: 'Google Font url', value: 'url' }
      ]
    },
    allFilters () {
      return {
        _and: [
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
