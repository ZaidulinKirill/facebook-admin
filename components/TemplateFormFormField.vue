<template>
  <div>
    <span v-if="label" style="font-size: 16px">{{ label }}</span>
    <v-btn
      color="primary"
      small
      depressed
      class="ml-4"
      :disabled="isItemDialogOpened"
      @click="selectedItem = null; isItemDialogOpened = true;"
    >
      <v-icon class="mr-2">
        add
      </v-icon> New form field
    </v-btn>
    <schema-table
      v-if="value"
      :items="value"
      :fields="headers"
      class="mt-2"
      :items-per-page="-1"
      hide-default-footer
      @opened="openItem($event)"
    >
      <template #[`body`]="{items}">
        <draggable
          :list="items"
          tag="tbody"
          handle=".handle"
          ghost-class=".ghost-preview"
          @change="onOrderChanged"
        >
          <tr
            v-for="(item, index) in items"
            :key="index"
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
              {{ (FormFieldsList.find(x => x.value === item.type) || {}).text }}
            </td>
            <td> {{ item.name || '-' }} </td>
            <td> {{ item[`label_${defaultLanguage.id}`] || item['label'] || '—' }} </td>
            <td> {{ (item.md || 0) * 10 }}% </td>
            <td> <v-simple-checkbox :value="item.required" /></td>
            <td>
              <v-btn icon small @click="cloneField(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </td>
            <td>
              <v-btn
                icon
                :disabled="item.type === 'form-submit-button'"
                @click="deleteItem(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </draggable>
      </template>

      <template #[`item.delete`]="{item}">
        <v-btn
          icon
          :disabled="item.type === 'form-submit-button'"
          @click="deleteItem(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </schema-table>

    <v-dialog
      v-if="isItemDialogOpened"
      v-model="isItemDialogOpened"
      :max-width="selectedItem && selectedItem.type === 'form-submit-button' ? 1100 : (selectedItem && selectedItem.type === 'form-spacing' ? 400 : 700)"
      persistent
    >
      <v-card>
        <v-card-title />
        <v-card-text :class="selectedItem && selectedItem.type === 'form-spacing' ? 'pt-5': ''">
          <template-form
            ref="form"
            v-model="selectedItem"
            :variables="fields"
            :languages="languages"
            @submit="onSubmit"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isItemDialogOpened = false; selectedItem=null;">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="$refs.form.submit()">
            {{ !!selectedItem ? 'Save' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { SchemaTable } from 'vuetify-schema-table'
import draggable from 'vuedraggable'
import { FormFields, FormFieldsData, FormFieldsList } from './template/form/fields'
import TemplateForm from './TemplateForm.vue'

export default {
  components: {
    draggable,
    SchemaTable,
    TemplateForm
  },
  props: {
    value: {
      type: Array,
      default: null
    },
    label: {
      type: String,
      default: null
    },
    languages: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isItemDialogOpened: false,
      selectedItem: null,
      selectedType: FormFields.TEXT,
      FormFieldsList
    }
  },
  computed: {
    headers () {
      return [
        { text: 'Sort', value: 'sort', sortable: false, width: 24 },
        { text: 'Edit', value: 'edit', sortable: false, width: 24 },
        { text: 'Field type', value: 'type', type: 'select', items: FormFieldsList },
        { text: 'Key', value: 'name' },
        { text: 'Label', value: 'label', language: true },
        { text: 'Width', value: 'width' },
        { text: 'Required', value: 'required', type: 'checkbox', width: 40 },
        { text: 'Clone', value: 'duplicate', sortable: false, width: 40 },
        { text: 'Delete', value: 'delete', sortable: false, width: 24 }
      ]
    },
    defaultLanguage () {
      return this.languages.find(x => x.isDefault)
    },
    selectedFieldData () {
      return FormFieldsData({ onTypeChanged: this.onTypeChanged, languages: this.languages })[this.selectedType]
    },
    fields () {
      return this.selectedFieldData.fields
        .filter(field => field.value !== 'type' || (this.selectedItem && this.selectedItem.type !== 'form-submit-button'))
        .map(field => ({
          ...field,
          ...field.value === 'type' && {
            items: field.items.filter(x => x.value !== 'form-submit-button')
          }
        }))
    }
  },
  watch: {
    selectedItem: {
      immediate: true,
      handler (value) {
        if (!value) {
          this.selectedItem = { type: FormFields.TEXT, ...FormFieldsData({ onTypeChanged: this.onTypeChanged, languages: this.languages })[FormFields.TEXT].default }
        }
      }
    },
    'selectedItem.type': {
      immediate: true,
      handler (value, oldValue) {
        if (value && value !== oldValue) {
          this.selectedType = value

          if (this.isItemDialogOpened) {
            this.selectedItem = { ...this.selectedFieldData.default, type: value }
          }
        }
      }
    },
    value: {
      handler (value) {
        if (!value) {
          this.$emit('change', [])
        }
      },
      immediate: true
    }
  },
  methods: {
    onOrderChanged ({ moved: { oldIndex, newIndex } }) {
      const cloned = [...this.value]
      const [element] = cloned.splice(oldIndex, 1)
      cloned.splice(newIndex, 0, element)

      this.$emit('change', cloned)
    },
    cloneField (item) {
      this.$emit('change', [...this.value, { ...item, id: new Date().valueOf() }])
    },
    onTypeChanged (type) {
      this.$set(this.selectedItem, 'type', type)
    },
    openItem (item) {
      this.selectedItem = item
      this.$nextTick(() => {
        this.isItemDialogOpened = true
      })
    },
    moveRow (item, direction) {
      const oldIdx = this.value.indexOf(item)
      const newIdx = oldIdx + direction

      const clone = [...this.value];
      [clone[oldIdx], clone[newIdx]] = [clone[newIdx], clone[oldIdx]]

      this.$emit('change', clone)
    },
    onSubmit (item) {
      if (item.id) {
        const index = this.value.findIndex(x => x.id === item.id)
        this.$emit('change', this.value.map((x, idx) => idx === index ? item : x))
      } else {
        this.$emit('change', [...this.value, { ...item, id: new Date().valueOf() }])
      }

      this.isItemDialogOpened = false
    },
    deleteItem (item) {
      const index = this.value.indexOf(item)
      this.$emit('change', this.value.filter((_, idx) => idx !== index))
    }
  }
}
</script>
<style>
.field-form .v-item-group {
  margin-bottom: 10px;
}
</style>
