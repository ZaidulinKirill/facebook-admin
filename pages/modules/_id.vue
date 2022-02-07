<template>
  <v-row class="fill-height no-title" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="mb-0 pb-0">
          <the-breadcrumbs :items="breadcrumbSections" />
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <hasura-form
            ref="form"
            v-model="item"
            source="Module"
            :item-id="$nuxt.$route.params.id"
            :fields="fields"
            flat
            class="no-title"
            @submit="onSubmit"
          >
            <template #title />
            <template #[`field.components`]="{item: row, $input}">
              <div class="mt-5 pr-lg-2">
                <h3 class="mb-3">
                  Components
                </h3>
                <json-editor :value="row.components" v-bind="componentsSchema" @input="$input('components', $event)" />
              </div>
            </template>
            <template #[`field.defaultVariables`]="{item: row, $input}">
              <div class="mt-5 pr-lg-2">
                <h3 class="mb-3">
                  Default variables
                </h3>
                <json-editor :value="row.defaultVariables" @input="$input('defaultVariables', $event)" />
              </div>
            </template>
            <template #[`field.variables`]="{item: row, $input}">
              <div class="mt-5 pl-lg-2">
                <h3 class="mb-3">
                  Variables definition
                </h3>
                <json-editor :value="row.variables" @input="$input('variables', $event)" />
              </div>
            </template>
            <template #[`field.theme`]="{item: row, $input}">
              <div class="mt-5 pr-lg-2">
                <h3 class="mb-3">
                  Theme
                </h3>
                <json-editor :value="row.theme" @input="$input('theme', $event)" />
              </div>
            </template>
            <template #actions="{isSaving, submit}">
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
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions } from 'vuex'
import { HasuraForm } from 'vuetify-hasura-form'
import FabButton from '~/components/FabButton'
import JsonEditor from '~/components/JsonEditor'
import TheBreadcrumbs from '~/components/TheBreadcrumbs'

export default {
  transition (to, from) {
    if (from && from.name === 'sites') {
      return 'slide-right'
    }
    return 'slide'
  },
  components: {
    FabButton,
    HasuraForm,
    TheBreadcrumbs,
    JsonEditor
  },
  data () {
    return {
      item: {},
      fields: [
        { label: 'Name', value: 'name', required: true, md: 3 },
        { label: 'Tag', value: 'tag', clearable: true, md: 3 },
        { label: 'Is edit dialog scrollable?', value: 'isEditDialogScrollable', type: 'checkbox', md: 2 },
        { label: 'Dialog width', value: 'dialogWidth', type: 'number', required: true, md: 2 },
        { label: 'System type', value: 'systemType', clearable: true, md: 2 },
        { label: 'Components', value: 'components', lg: 6 },
        { label: 'Variables', value: 'variables', lg: 6 },
        // { label: 'Theme', value: 'theme', lg: 6 },
        { label: 'Default variables', value: 'defaultVariables', lg: 6 },
        { label: 'Preview', value: 'previewImageId', type: 'file', lg: 6 }
      ],
      componentsSchema: {
        schema: {
          title: 'DOM',
          type: 'array',
          items: {
            $ref: 'component'
          }
        },
        schemaRefs: {
          component: {
            title: 'Component',
            type: 'object',
            required: ['type'],
            properties: {
              type: {
                type: 'string'
              },
              content: {
                anyOf: [
                  { $ref: 'component' },
                  { type: 'array', items: { $ref: 'component' } },
                  { type: 'string' }
                ]
              }
            }
          }
        }
      }
    }
  },
  computed: {
    breadcrumbSections () {
      return [
        { text: 'Modules', to: '/modules', exact: true },
        { text: this.item.name, disabled: true }
      ]
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    onSubmit () {
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
