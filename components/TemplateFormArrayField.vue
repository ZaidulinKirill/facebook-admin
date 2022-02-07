<template>
  <div>
    <span v-if="label" style="font-size: 16px">{{ label }}</span>
    <v-btn
      color="primary"
      small
      depressed
      class="ml-4"
      :disabled="isItemDialogOpened"
      @click="selectedItem = {}; isItemDialogOpened = true;"
    >
      <v-icon class="mr-2">
        add
      </v-icon> New item
    </v-btn>
    <schema-table
      v-if="value"
      :items="value"
      :fields="allHeaders"
      :footer-props="{ itemsPerPageOptions: [5, 20, 40] }"
      @opened="openItem($event)"
    >
      <template #[`item.sort`]="{item}">
        <div class="d-flex flex-column">
          <v-btn
            icon
            color="black"
            x-small
            :disabled="item === value[0]"
            @click.prevent.stop="moveRow(item, -1)"
          >
            <v-icon small>
              mdi-arrow-up
            </v-icon>
          </v-btn>
          <v-btn
            icon
            color="black"
            x-small
            :disabled="item === value[value.length-1]"
            @click.prevent.stop="moveRow(item, 1)"
          >
            <v-icon small>
              mdi-arrow-down
            </v-icon>
          </v-btn>
        </div>
      </template>
      <template v-for="header in headers.filter(x => x.language)" #[`item.${header.value}`]="{item}">
        {{ item[`${header.value}_${defaultLanguage.id}`] || item[header.value] || '—' }}
      </template>
      <template #[`item.edit`]="{item}">
        <v-btn
          icon
          @click="openItem(item)"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <template #[`item.delete`]="{item}">
        <v-btn
          icon
          @click="deleteItem(item)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </schema-table>

    <v-dialog
      v-if="isItemDialogOpened"
      v-model="isItemDialogOpened"
      :max-width="dialogWidth"
      persistent
      :retain-focus="false"
    >
      <v-card>
        <v-card-title>Edit item</v-card-title>
        <v-card-text>
          <template-form
            ref="form"
            :value="selectedItem"
            :variables="variables"
            :languages="languages"
            @submit="onSchemaFormSubmit($event)"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isItemDialogOpened = false; selectedItem=null;">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="submitForm">
            {{ !!selectedItem ? 'Save' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { SchemaTable } from 'vuetify-schema-table'

export default {
  components: {
    SchemaTable,
    TemplateForm: () => import('~/components/TemplateForm.vue')
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
    headers: {
      type: Array,
      required: true
    },
    variables: {
      type: Array,
      required: true
    },
    languages: {
      type: Array,
      required: true
    },
    dialogWidth: {
      type: Number,
      default: 700
    }
  },
  data () {
    return {
      isItemDialogOpened: false,
      selectedItem: null
    }
  },
  computed: {
    defaultLanguage () {
      return this.languages.find(x => x.isDefault)
    },
    allHeaders () {
      return [
        { text: 'Sort', value: 'sort', sortable: false, width: 24 },
        { text: 'Edit', value: 'edit', sortable: false, width: 24 },
        ...(this.headers || []).map(x => ({
          ...x,
          ...x.type === 'image' && {
            resolveValue: id => ({ url: `/api/uploads/w_128/${id}` })
          }
        })),
        { text: 'Delete', value: 'delete', sortable: false, width: 24 }
      ]
    }
  },
  watch: {
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
    submitForm () {
      this.$refs.form.submit()
    },
    onSchemaFormSubmit (item) {
      this.$set(this, 'selectedItem', item)
      this.$nextTick(() => {
        this.onSubmit()
      })
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
    onSubmit () {
      if (this.selectedItem.id !== undefined) {
        const index = this.value.findIndex(x => x.id === this.selectedItem.id)
        this.$emit('change', this.value.map((x, idx) => idx === index ? this.selectedItem : x))
      } else {
        this.$emit('change', [...this.value, { ...this.selectedItem, id: new Date().valueOf() }])
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
