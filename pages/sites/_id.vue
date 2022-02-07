<template>
  <v-row class="fill-height no-title" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="mb-0 pb-0 d-flex">
          <the-breadcrumbs :items="breadcrumbSections" />
          <v-spacer />
          <v-btn class="ml-auto mr-4" outlined x-small @click="clearCache">
            Clear cache
          </v-btn>
        </v-card-title>
        <v-card-text>
          <hasura-form
            ref="form"
            v-model="item"
            source="Site"
            :item-id="$nuxt.$route.params.id"
            :fields="fields"
            flat
            :custom-selections="customSelections"
            :pre-mutation="preMutation"
            class="no-title"
            @submit="onSubmit"
          >
            <template #title />
            <template #[`field.modules`]="{item: row}">
              <page-modules-table :page-id="row.pages && row.pages.length && row.pages[0].id" />
            </template>

            <template #[`field.aside`]="{item: row}">
              <div class="d-flex flex-column pl-md-5">
                <site-languages-table :site-id="row.id" />
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
import gql from 'graphql-tag'
import FabButton from '~/components/FabButton'
import TheBreadcrumbs from '~/components/TheBreadcrumbs'
import PageModulesTable from '~/components/PageModulesTable'
import SiteLanguagesTable from '~/components/SiteLanguagesTable'

export default {
  transition (to, from) {
    if (from && from.name === 'sites') {
      return 'slide-right'
    }

    return 'slide-left'
  },
  components: {
    FabButton,
    HasuraForm,
    TheBreadcrumbs,
    PageModulesTable,
    SiteLanguagesTable
  },
  data () {
    return {
      item: {},
      customSelections: selections => [...selections, 'languages { language { id code } } pages (where: { slug: { _eq: "index" } }) { id }'],
      preMutation: ({ pages, subdomain, languages, ...item }) => ({ ...item, subdomain: subdomain.toLowerCase().replace(/[^a-z]/g, '') }),
      fields: [
        { label: 'Subdomain', value: 'subdomain', required: true, md: 4 },
        { label: 'Primary font', value: 'fontId', type: 'font', required: true, md: 4 },
        { label: 'Primary color', value: 'primaryColor', type: 'color', md: 'auto', clearable: false },
        { label: 'Favicon', value: 'faviconId', type: 'file', md: 2, caption: '<span style="font-weight: 500;">Format: </span> any image format. It will be automatically scaled to 16x16.' },
        { label: 'Pages', value: 'modules', selectable: false, editable: false, md: 8, lg: 8 },
        { value: 'aside', md: 4, lg: 4, selectable: false, editable: false }

      ]
    }
  },
  computed: {
    breadcrumbSections () {
      return [
        { text: 'Sites', to: '/sites', exact: true },
        { text: this.item.subdomain, disabled: true }
      ]
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    async clearCache () {
      await this.$apollo.mutate({
        mutation: gql`mutation Update($id: uuid!) {
          update_Site_by_pk(pk_columns: {id: $id}, _set: {cacheTrigger: "${new Date().toISOString()}"}) {id}
        }`,
        variables: {
          id: this.item.id
        }
      })
    },
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

<style>
.drag-and-drop-editor .v-card.v-card--link.v-sheet {
  box-shadow: none !important;
}

.drag-and-drop-editor .v-card.v-card--link.v-sheet div.pt-2.px-2{
  display: none !important;
}

.drag-and-drop-editor .v-card.v-card--link.v-sheet .v-image {
  border-radius: 4px;
}

.drag-and-drop-editor {
  margin-top: -18px;
}

.drag-and-drop-editor .v-subheader {
  font-size: 14px !important;
}

.drag-and-drop-editor .v-card__text {
  padding: 0px !important;
}

.drag-and-drop-editor .col.col-12 {
  margin-top: 0px !important;
}

.drag-and-drop-editor .row > div{
  justify-content: flex-start !important;
}

</style>
