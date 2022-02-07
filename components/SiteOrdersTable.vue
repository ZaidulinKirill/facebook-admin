<template>
  <div>
    <div class="d-flex align-center">
      <h3 class="flex-grow-1">
        {{ title }}
      </h3>
      <span style="color: black;margin-right: 10px;">Entries: {{ allEntriesCount - newEntries.length }}</span>
      <v-tooltip bottom open-delay="500">
        <template #activator="{on}">
          <v-btn
            class="ml-2 px-0"
            :text="newEntries.length === 0"
            color="primary"
            @click="fetchNewItems"
            v-on="on"
          >
            <v-icon class="mr-2">
              mdi-refresh
            </v-icon>
            +{{ newEntries.length }}
          </v-btn>
        </template>
        Fetch new entries
      </v-tooltip>
      <v-tooltip v-if="showStage1Top" bottom open-delay="500">
        <template #activator="{on}">
          <v-btn
            class="ml-2"
            text
            color="primary"
            @click="selectedTopSongsStage='stage-1'; isTopSongsDialogOpened = true"
            v-on="on"
          >
            <v-icon class="mr-2">
              mdi-ballot-outline
            </v-icon>
            Stage 1 songs top
          </v-btn>
        </template>
        Top of the songs in 1-st stage
      </v-tooltip>
      <v-tooltip v-if="showStage2Top" bottom open-delay="500">
        <template #activator="{on}">
          <v-btn
            class="ml-2"
            text
            color="primary"
            @click="selectedTopSongsStage='stage-2'; isTopSongsDialogOpened = true"
            v-on="on"
          >
            <v-icon class="mr-2">
              mdi-ballot-outline
            </v-icon>
            Stage 2 songs top
          </v-btn>
        </template>
        Top of the songs in 2-st stage
      </v-tooltip>
      <v-tooltip bottom open-delay="500">
        <template #activator="{on}">
          <v-btn
            class="ml-2"
            text
            color="primary"
            @click="isExportDialogOpened = true"
            v-on="on"
          >
            <v-icon class="mr-2">
              mdi-microsoft-excel
            </v-icon>
            Export
          </v-btn>
        </template>
        Export
      </v-tooltip>
      <v-tooltip v-if="isFileColumnExists" bottom open-delay="500">
        <template #activator="{on}">
          <v-btn
            class="ml-2"
            text
            color="primary"
            :loading="isExportPhotosDialogOpened"
            :disabled="!pageModule"
            @click="isExportConfirmationDialogOpened = true"
            v-on="on"
          >
            <v-icon class="mr-2">
              mdi-image-multiple
            </v-icon>
            Export images
          </v-btn>
        </template>
        Export photos to carousel
      </v-tooltip>
    </div>
    <hasura-table
      ref="Orders"
      hide-default-footer
      source="Order"
      :fields="headers"
      :filters="{ siteId: { _eq: siteId }, formModuleId: {_eq: pageModuleId} }"
      :disabled="disabled || !siteId || !pageModule"
      sort-by="created_at"
      sort-desc
      default-selections="id data"
      :skeleton-rows-count="3"
      :items-per-page="-1"
      :footer-props="{ itemsPerPageOptions: [-1] }"
      @items-updated="allEntries = $event"
    >
      <template #[`item.data`]="{item}">
        {{ item.data }}
      </template>
      <template v-for="header in headers.filter(x => ['form-select-field', 'form-checkbox-field', 'form-radio-field'].includes(x.type))" #[`header.${header.value}`]="{header: item}">
        <span :key="header.value">
          {{ item.text }}
          <v-tooltip bottom open-delay="300">
            <template #activator="{on}">
              <v-btn icon color="primary" small v-on="on" @click="showStatsOfHeader(item)">
                <v-icon small>mdi-help-circle-outline</v-icon>
              </v-btn>
            </template>
            Show statistics
          </v-tooltip>
        </span>
      </template>
      <template v-for="formField in formFields" #[`item.${formField.name}`]="{item}">
        <template v-if="formField.type === 'form-audio-recorder'">
          <div v-if="item.data[formField.name]" :key="formField.name" class="d-flex align-center">
            <wave-surfer-audio-player :src="`/api/uploads/${item.data[formField.name]}`" />
            <v-btn
              class="ml-3"
              icon
              color="primary"
              :href="`/api/uploads/${item.data[formField.name]}`"
              :download="`${site.subdomain}_${firstTextField && item.data[firstTextField.name] ? `${item.data[firstTextField.name]}_` : ''}${$moment(item.created_at).format('DD-MM-YYYY-HH-mm')}.wav`"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </div>
          <template v-else>
            No audio
          </template>
        </template>
        <template v-else-if="formField.type === 'form-file-upload'">
          <div v-if="item.data[formField.name]" :key="formField.name" class="d-flex align-center">
            <file-preview :file-id="item.data[formField.name]" :file="files.find(x => x.id === item.data[formField.name])" />
          </div>
          <template v-else>
            —
          </template>
        </template>
        <template v-else-if="formField.type === 'form-song-selection'">
          {{ item.data[formField.name] ? getSongName(item.data[formField.name]) : '—' }}
        </template>
        <template v-else-if="formField.type === 'form-songs-top'">
          <ul v-if="item.data[formField.name]" :key="formField.name" style="list-style: auto;">
            <li v-for="song in item.data[formField.name] || []" :key="song.trackId">
              {{ getSongName(song) }}
            </li>
          </ul>
          <span v-else :key="`${formField.name}-empty`">—</span>
        </template>
        <template v-else>
          {{ item.data[formField.name] && item.data[formField.name].toString().length ? item.data[formField.name] : '—' }}
        </template>
      </template>
    </hasura-table>

    <v-dialog v-model="isTopSongsDialogOpened" max-width="500" persistent>
      <v-card v-if="isTopSongsDialogOpened">
        <v-card-title>
          Songs top
        </v-card-title>
        <v-card-text>
          <songs-top-list :page-module-id="pageModuleId" :stage="selectedTopSongsStage" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isTopSongsDialogOpened = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isExportDialogOpened" max-width="400" persistent>
      <v-card v-if="isExportDialogOpened">
        <v-card-title>Export entries</v-card-title>
        <v-card-text>
          <schema-form
            ref="exportForm"
            :value="{ delimiter: prefs.csvDelimiter }"
            :fields="exportFields"
            @submit="exportEntries"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isExportDialogOpened = false">
            Close
          </v-btn>
          <v-btn color="primary" :loading="isExporting" @click="$refs.exportForm.submit()">
            Export
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isHeaderStatsOpened" max-width="400" persistent>
      <v-card v-if="isHeaderStatsOpened">
        <v-card-title>Statistics for {{ headerStats.header }}</v-card-title>
        <v-card-text>
          <ul style="list-style: auto;">
            <li v-for="stat in headerStats.items" :key="stat.value">
              {{ stat.value }}: {{ stat.percent }}% ({{ stat.count }} votes)
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isHeaderStatsOpened = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="isSnackbar"
      :timeout="2000"
    >
      {{ snackbarText }}
    </v-snackbar>

    <confirmation-dialog
      v-model="isExportConfirmationDialogOpened"
      @confirm="exportPhotos"
      @decline="isExportConfirmationDialogOpened = false"
    />
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
import { HasuraTable } from 'vuetify-hasura-table'
import { SchemaForm } from 'vuetify-schema-form'
import { mapState, mapMutations, mapActions } from 'vuex'
import isImage from 'is-image'
import splitByChunks from 'lodash.chunk'
import ConfirmationDialog from 'vuetify-schema-form/src/components/ConfirmationDialog'
import WaveSurferAudioPlayer from './WaveSurferAudioPlayer'
import SongsTopList from './SongsTopList'
import FilePreview from './FilePreview'

const chunkedPromiseAll = async (promises, concurrency = 5) => {
  const chunks = splitByChunks(promises, concurrency)
  const results = []
  for (let index = 0; index < chunks.length; index++) {
    const chunk = chunks[index]
    // eslint-disable-next-line no-await-in-loop
    results.push(...await Promise.all(chunk.map(f => f())))
  }

  return results
}

export default {
  components: {
    HasuraTable,
    SchemaForm,
    WaveSurferAudioPlayer,
    SongsTopList,
    FilePreview,
    ConfirmationDialog
  },
  props: {
    title: {
      type: String,
      default: null
    },
    siteId: {
      type: String,
      default: null
    },
    pageModuleId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    $subscribe: {
      newEntries: {
        query () {
          return gql`subscription GetEntries($where: Order_bool_exp!) {
            Order(where: $where, order_by: { created_at: asc}) {
              id
              isRemoved
              language { id name }
              created_at
              data
            }
          }`
        },
        variables () {
          return {
            where: {
              siteId: { _eq: this.siteId },
              formModuleId: { _eq: this.pageModuleId },
              created_at: { _gt: this.lastFetchDate }
            }
          }
        },
        result ({ data }) {
          this.newEntries = data.Order
        },
        skip () {
          return !this.lastFetchDate
        }
      },
      allEntriesCount: {
        query () {
          return gql`subscription GetAllEntries($where: Order_bool_exp!) {
            Order_aggregate(where: $where) {
              aggregate { count }
            }
          }`
        },
        variables () {
          return {
            where: {
              siteId: { _eq: this.siteId },
              formModuleId: { _eq: this.pageModuleId }
            }
          }
        },
        result ({ data }) {
          this.allEntriesCount = data.Order_aggregate.aggregate.count
        }
      }
    },
    site: {
      query: gql`query GetSite($itemId: uuid!) {
        site: Site_by_pk(id: $itemId) {
          id
          subdomain
          languages {
            language {
              id
              name
            }
          }
        }
      }`,
      variables () {
        return {
          itemId: this.siteId
        }
      },
      skip () {
        return !this.siteId
      }
    },
    pageModule: {
      query: gql`query GetModule($itemId: uuid!) {
        pageModule: PageModule_by_pk(id: $itemId) {
          id
          variables
          module {
            id
            variables
          }
          page {
            id
            site  {
              id
              languages {
                isDefault
                languageId
              }
            }
          }
        }
      }`,
      variables () {
        return {
          itemId: this.pageModuleId
        }
      },
      skip () {
        return !this.pageModuleId
      }
    },
    files: {
      query: gql`query GetFiles($ids: [uuid!]!) {
        files: File(where: {id: {_in: $ids}}) {
          id
          type
        }
      }`,
      variables () {
        const ids = this.formFields
          .filter(formField => formField.type === 'form-file-upload')
          .map(formField => this.allEntries.filter(entry => entry.data[formField.name]).map(entry => entry.data[formField.name]))
          .flat()

        return {
          ids
        }
      },
      skip () {
        return !this.allEntries.length || !this.formFields.length
      }
    }
  },
  data () {
    return {
      allEntries: [],
      files: [],
      isExportConfirmationDialogOpened: false,
      isHeaderStatsOpened: false,
      headerStats: null,
      isSnackbar: false,
      snackbarText: '',
      isExportPhotosDialogOpened: false,
      allEntriesCount: 0,
      newEntries: [],
      lastFetchDate: new Date().toISOString(),
      selectedTopSongsStage: 'stage-1',
      isTopSongsDialogOpened: false,
      isExporting: false,
      isExportDialogOpened: false,
      pageModule: null,
      site: null,
      exportFields: [
        { label: 'CSV delimiter', value: 'delimiter', placeholder: ',', required: true }
      ]
    }
  },
  computed: {
    ...mapState(['prefs']),
    isFileColumnExists () {
      return this.formFields.find(x => x.type === 'form-file-upload')
    },
    showStage1Top () {
      return !!this.formFields.filter(x => x.type === 'form-song-selection').length
    },
    showStage2Top () {
      return !!this.formFields.filter(x => x.type === 'form-songs-top').length
    },
    firstTextField () {
      return this.formFields.find(x => x.type === 'form-input-field')
    },
    formFields () {
      if (!this.pageModule) {
        return []
      }

      const fields = this.pageModule.variables['Main form'].filter(x => !!x.name)

      return fields.map(field => ({
        ...field,
        text: field.name,
        value: field.name
      }))
    },
    headers () {
      return [
        { text: 'Created', value: 'created_at', type: 'datetime', width: 150 },
        ...this.formFields
          .filter(x => !!x)
          .map(field => ({
            ...field,
            selectable: false,
            sortable: false
          })),
        { text: 'Language', value: 'language { id *name* }' }
      ]
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    ...mapMutations(['SET_PREFS']),
    showStatsOfHeader (header) {
      const entries = this.allEntries
      const aggregatedInfo = entries.map(x => x.data[header.value]).reduce((acc, item) => {
        acc[item] = acc[item] || 0
        acc[item] += 1

        return acc
      }, {})

      const stats = Object.entries(aggregatedInfo)
        .map(([key, value]) => ({
          value: key === 'undefined'
            ? '[Empty]'
            : key,
          percent: (value * 100 / entries.length).toFixed(0),
          count: value
        }))
        .sort((a, b) => b.count - a.count)

      this.isHeaderStatsOpened = true
      this.headerStats = {
        header: header.value,
        items: stats
      }
    },
    async exportPhotos () {
      try {
        this.isExportPhotosDialogOpened = true
        this.isExportConfirmationDialogOpened = false

        const entries = this.allEntries
        const fields = this.formFields.filter(x => x.type === 'form-file-upload').map(x => x.value)
        const images = await chunkedPromiseAll(entries.map(entry => fields.map(field => async () => {
          const itemId = entry.data[field]
          if (!itemId) {
            return null
          }

          const { data } = await this.$apollo.query({
            query: gql`query GetFile($itemId: uuid!) {
            file: File_by_pk(id: $itemId) {
              id
              type
            }
          }`,
            variables: {
              itemId
            }
          })

          const type = data.file.type.replace('.', '')
          if (isImage(`file.${type}`)) {
            return itemId
          }

          return null
        })).flat())

        const { data: { modules: [module] } } = await this.$apollo.query({
          query: gql`{
            modules: Module(where: { systemType: { _eq: "image-carousel" } }) {
              id
            }
          }`
        })

        const { data: { modules: [lastModule] } } = await this.$apollo.query({
          query: gql`query FindLastModule($id: uuid!) {
            modules: PageModule(where: {pageId: {_eq: $id}}, order_by: {sort: desc}) {
              id
              sort
            }
          }`,
          variables: {
            id: this.pageModule.page.id
          }
        })

        await this.$apollo.mutate({
          mutation: gql`mutation Insert($item: PageModule_insert_input!) {
          insert_PageModule_one(object: $item) {
            id
          }
        }`,
          variables: {
            item: {
              pageId: this.pageModule.page.id,
              moduleId: module.id,
              sort: lastModule ? lastModule.sort + 1 : 0,
              isEnabled: false,
              name: 'Images from Form',
              variables: {
                images: images.filter(x => !!x).map(image => ({ id: image, image }))
              }
            }
          }
        })

        this.isSnackbar = true
        this.snackbarText = 'Carousel created'
        this.isExportPhotosDialogOpened = false
      } catch (error) {
        this.SET_ERROR({ message: error.message })
      }
    },
    fetchNewItems () {
      this.lastFetchDate = new Date().toISOString()
      this.newEntries.forEach((row) => {
        this.$refs.Orders.addRow(row)
      })
    },
    getSongName (song) {
      return `${song.artistName} - ${song.trackName}`
    },
    isNotDefined (value) {
      return value === null || value === undefined
    },
    async exportEntries (exportParams) {
      this.isExporting = true

      const response = await this.$axios({
        url: `/api/entries/${this.pageModuleId}?delimiter=${exportParams.delimiter}`,
        method: 'GET',
        responseType: 'blob'
      })

      const filename = `${this.site.subdomain}${this.$moment().format('DD-MM-YYYY-HH-mm')}_entries.csv`
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()

      this.SET_PREFS({
        ...this.prefs,
        csvDelimiter: exportParams.delimiter
      })

      this.isExporting = false
      this.isExportDialogOpened = false
    }
  }

}
</script>
