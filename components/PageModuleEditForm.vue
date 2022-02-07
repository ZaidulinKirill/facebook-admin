<template>
  <hasura-form
    ref="form"
    v-model="item"
    source="PageModule"
    :item-id="pageModuleId"
    :fields="fields"
    flat
    :custom-selections="customSelections"
    :pre-mutation="preMutation"
    :class="!title.length ? 'no-title': ''"
    @submit="onSubmit"
  >
    <template #title>
      {{ title }}
    </template>
    <template #[`field.line`]="{}">
      <div style="border-bottom: thin solid #2A3042" class="mt-5 mb-5" />
    </template>
    <template #[`field.editor`]="{item: row, $input}">
      <template-form
        v-if="item && item.variables"
        ref="form"
        v-model="row.variables"
        :variables="item.module.variables"
        :languages="item.page.site.languages.map(x => ({...x.language, isDefault: x.isDefault}))"
        @submit="onSchemaFormSubmit($input, $event)"
      />
    </template>
    <template v-if="modal" #actions="{isNew, isSaving, submit}">
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="$emit('close')">
          Cancel
        </v-btn>
        <v-btn color="primary" :loading="isSaving" @click="submitForm(submit)">
          {{ isNew ? 'Save' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </template>
    <template v-else #actions="{isSaving, submit}">
      <fab-button
        tooltip="Save"
        dark
        icon="mdi-content-save"
        :loading="isSaving"
        @click="submit"
      />
      <fab-button
        tooltip="Save and exit"
        dark
        icon="mdi-exit-to-app"
        :loading="isSaving"
        small
        @click="submit(() => $nuxt.$router.back())"
      />
    </template>
  </hasura-form>
</template>

<script>
import { HasuraForm } from 'vuetify-hasura-form'
import { mapActions } from 'vuex'
import FabButton from './FabButton'
import TemplateForm from './TemplateForm'

export default {
  components: {
    HasuraForm,
    TemplateForm,
    FabButton
  },
  props: {
    pageModuleId: {
      type: String,
      required: true
    },
    modal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      customSelections: selections => [...selections, 'id'],
      preMutation: ({ page, module, ...item }) => item,
      item: {},
      fields: [
        { label: 'Editor', value: 'editor', selector: 'page { id site { id languages { isDefault language { id name } } } } variables module { id systemType variables }', md: 12, editable: false },
        {
          value: 'line',
          editable: false,
          selectable: false,
          md: 12,
          if: ({ item }) => item && item.module && item.module.systemType !== 'head'
        },
        { label: 'Name', value: 'name', md: 3, clearable: true },
        { label: 'Active from', value: 'startDate', type: 'datetime', md: 3, menuProps: { offsetOverflow: true }, if: ({ item }) => item && item.module && item.module.systemType !== 'head' },
        { label: 'Active until', value: 'endDate', type: 'datetime', md: 3, menuProps: { offsetOverflow: true }, if: ({ item }) => item && item.module && item.module.systemType !== 'head' },
        { label: 'System type', value: 'systemType', md: 3, clearable: true }
      ]
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    submitForm (submit) {
      this.hasurFormSubmit = submit
      this.$refs.form.submit()
    },
    onSchemaFormSubmit ($input, item) {
      $input('variables', item)
      this.$nextTick(() => {
        this.hasurFormSubmit()
      })
    },
    onSubmit () {
      this.refreshCache()

      this.$emit('submit')
    }
  }
}
</script>
