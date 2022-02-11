<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title class="d-flex align-center">
          Sites
          <v-text-field
            v-model="search"
            class="ml-auto pl-2 mt-2 mt-sm-0"
            style="max-width: 500px; height: 30px;"
            dense
            solo
            single-line
            placeholder="Search by name"
          >
            <template #prepend-inner>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-tooltip left>
                    <template #activator="{on: tooltipOn}">
                      <v-btn
                        icon
                        v-bind="attrs"
                        v-on="{...on, ...tooltipOn}"
                      >
                        <v-icon>mdi-filter-plus</v-icon>
                      </v-btn>
                    </template>
                    Add filter
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in filterOptions"
                    :key="index"
                    @click="selectedFilters.push(item)"
                  >
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-text-field>
        </v-card-title>
        <v-card-title v-if="selectedFilters.length" class="my-0">
          <v-row>
            <v-col v-for="(filter, i) in selectedFilters" :key="i" cols="auto">
              <selected-filter-option v-model="selectedFilters[i]" @remove="selectedFilters.splice(i, 1)" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-3">
          <hasura-table
            source="Site"
            :fields="headers"
            :filters="allFilters"
            sort-by="created_at"
            sort-desc
            @opened="openSite($event.id)"
          >
            <template #[`item.subdomain`]="{item}">
              <v-tooltip bottom>
                <template #activator="{on: on}">
                  <v-btn
                    icon
                    class="mr-2"
                    v-on="on"
                    @click="openSitePage(item.subdomain)"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </template>
                Open site
              </v-tooltip>
              {{ item.subdomain }}
            </template>
            <template #[`item.languages`]="{item}">
              {{ item.languages.map(x => x.language.name).join(', ') }}
            </template>
            <template #[`item.edit`]="{item}">
              <v-btn
                icon
                @click="openSite(item.id)"
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
        :value="defaultItem"
        source="Site"
        :item-id="selectedItem.id"
        :fields="fields"
        :mutation="createSite"
        @submit="onSubmit"
      >
        <template #title>
          Create a site
        </template>
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
import { gql } from 'graphql-tag'
import FabButton from '~/components/FabButton'
import SelectedFilterOption from '~/components/SelectedFilterOption'

export default {
  transition (to, from) {
    if (from && (from.name === 'sites-id' || from.name === 'orders')) {
      return 'slide-left'
    }

    return 'slide'
  },
  components: {
    HasuraTable,
    HasuraForm,
    FabButton,
    SelectedFilterOption
  },
  data () {
    return {
      selectedFilters: [],
      search: '',
      isEditItemDialogOpened: false,
      selectedItem: {},
      defaultItem: {
        primaryColor: '#035f64'
      },
      fields: [
        { label: 'Subdomain', value: 'subdomain', required: true, md: 6 },
        {
          label: 'Default language',
          value: 'defaultLanguageId',
          type: 'remote',
          query: 'Language { id name }',
          itemText: 'name',
          itemValue: 'id',
          required: ({ item }) => !item.siteId,
          md: 6,
          disabled: ({ item }) => !!item.siteId
        },
        { label: 'Primary font', value: 'fontId', type: 'font', required: ({ item }) => !item.siteId, md: 6, disabled: ({ item }) => !!item.siteId },
        { label: 'Primary color', value: 'primaryColor', type: 'color', required: ({ item }) => !item.siteId, md: 'auto', disabled: ({ item }) => !!item.siteId },
        {
          label: 'Clone site',
          value: 'siteId',
          type: 'remote',
          query: 'Site { id subdomain }',
          itemText: 'subdomain',
          itemValue: 'id',
          clearable: true,
          md: 12
        }
      ],
      headers: [
        { text: 'Edit', value: 'edit', width: 24, selectable: false, sortable: false, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 } },
        { text: 'Subdomain', value: 'subdomain' },
        { text: 'Favicon', value: 'faviconId', type: 'image', resolveValue: id => ({ url: `/api/uploads/w_64,h_64/${id}` }) },
        // { text: 'Pages', value: 'pages_aggregate { aggregate { *count* } }' },
        { text: 'Languages', value: 'languages', selector: 'languages { language { id *name* } }' },
        { text: 'Created', value: 'created_at', type: 'date' }
      ],
      filterOptions: []
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    allFilters () {
      return {
        _and: [
          Object.assign({}, ...this.selectedFilters
            .filter(filter => filter.selected || filter.selected === false)
            .map(filter => filter.resolver
              ? filter.resolver(filter.selected)
              : ({ [filter.value]: { [filter.filter || (filter.type === 'select' ? '_eq' : '_in')]: filter.selected } }))),
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
    openSitePage (subdomain) {
      window.open('https://tomra50.com?view=true', '_blank')
    },
    async createSite ({ item: { defaultLanguageId, defaultTemplateId, siteId, ...item } }) {
      item.subdomain = item.subdomain.toLowerCase().replace(/[^a-z]/g, '')

      if (siteId) {
        const { data: { site } } = await this.$apollo.query({
          query: gql`query Get($id: uuid!) {
            site: Site_by_pk(id: $id) {
              id
              fontId
              primaryColor
              languages {
                languageId
                isDefault
                sort
              }
              pages {
                id
                slug
                modules {
                  id
                  startDate
                  endDate
                  isEnabled
                  moduleId
                  name
                  sort
                  variables
                }
              }
            } 
          }
        `,
          variables: {
            id: siteId
          }
        })

        const { data: { insert_Site_one: createdItem } } = await this.$apollo.mutate({
          mutation: gql`mutation Insert($item: Site_insert_input!) {
          insert_Site_one(object: $item) {
            id
          }
        }`,
          variables: {
            item: {
              subdomain: item.subdomain,
              fontId: site.fontId,
              primaryColor: site.primaryColor,
              languages: {
                data: site.languages.map(({ __typename, ...language }) => language)
              },
              pages: {
                data: site.pages.map(page => ({
                  slug: page.slug,
                  modules: {
                    data: page.modules.map(({ id, __typename, ...module }) => module)
                  }
                }))
              }
            }
          }
        })

        return createdItem
      } else {
        const { data: { Module: [headModule] } } = await this.$apollo.query({
          query: gql`query Find($where: Module_bool_exp!) {
          Module(where: $where) {
            id
            defaultVariables
          }
        }`,
          variables: {
            where: {
              systemType: { _eq: 'head' }
            }
          }
        })

        const { data: { insert_Site_one: createdItem } } = await this.$apollo.mutate({
          mutation: gql`mutation Insert($item: Site_insert_input!) {
          insert_Site_one(object: $item) {
            id
          }
        }`,
          variables: {
            item: {
              ...item,
              pages: {
                data: [
                  {
                    slug: 'index',
                    ...headModule && {
                      modules: {
                        data: [
                          { moduleId: headModule.id, variables: headModule.defaultVariables, sort: -100 }
                        ]
                      }
                    }
                  }
                ]
              },
              languages: {
                data: {
                  languageId: defaultLanguageId,
                  isDefault: true
                }
              }
            }
          }
        })
        return createdItem
      }
    },
    openSite (siteId) {
      this.$nuxt.$router.push(`/sites/${siteId}`)
    },
    onSubmit ({ item }) {
      this.isEditItemDialogOpened = false
      this.refreshCache()

      this.openSite(item.id)
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
