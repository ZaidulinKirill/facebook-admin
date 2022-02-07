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
            source="Page"
            :item-id="$nuxt.$route.params.id"
            :fields="fields"
            flat
            :custom-selections="customSelections"
            :pre-mutation="preMutation"
            class="no-title"
            @submit="onSubmit"
          >
            <template #title />
            <template #[`field.variants`]="{item: row}">
              <page-languages-table :disabled="!row.id" :page-id="row.id" />
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
import TheBreadcrumbs from '~/components/TheBreadcrumbs'
import PageLanguagesTable from '~/components/PageLanguagesTable'

export default {
  transition (to, from) {
    if (from && from.name === 'sites-id') {
      return 'slide-right'
    }

    return 'slide-left'
  },
  components: {
    FabButton,
    HasuraForm,
    TheBreadcrumbs,
    PageLanguagesTable
  },
  data () {
    return {
      customSelections: selections => [...selections, 'type', 'site { id subdomain }'],
      preMutation: ({ site, ...item }) => item,
      item: {},
      fields: [
        // { label: 'Name', value: 'name', required: true, md: 6 },
        { label: 'Slug', value: 'slug', required: true, md: 6 },
        { label: 'Active from', value: 'startDate', type: 'datetime', menuProps: { offsetOverflow: true }, clearable: true, md: 3 },
        { label: 'Active until', value: 'endDate', type: 'datetime', menuProps: { offsetOverflow: true }, clearable: true, md: 3 },
        { label: 'Variants', value: 'variants', selectable: false, editable: false }
      ]
    }
  },
  computed: {
    breadcrumbSections () {
      return [
        { text: 'Sites', to: '/sites', exact: true },
        ...this.item.site ? [
          { text: this.item.site.subdomain, to: `/sites/${this.item.site.id}`, exact: true },
          { text: this.item.slug, disabled: true }
        ] : []
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
