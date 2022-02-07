<template>
  <div>
    <h3 class="mt-5 mb-2">
      {{ statistics ? 'Statistics': 'Languages' }}
      <v-btn
        v-if="!statistics"
        color="primary"
        small
        depressed
        class="ml-4"
        :disabled="isNewItemDialogOpened"
        @click="isNewItemDialogOpened = true"
      >
        <v-icon class="mr-2">
          add
        </v-icon> Select language
      </v-btn>
      <v-btn
        depressed
        text
        color="primary"
        small
        outlined
        class="ml-2"
        @click="selectedItem = null; isStatisticsDialogOpened = true;"
      >
        Show total stats
      </v-btn>
    </h3>
    <hasura-table
      ref="table"
      source="SiteLanguageBridge"
      :fields="headers"
      :filters="{ siteId: { _eq: siteId } }"
      :disabled="disabled || !siteId"
      :no-delete="statistics"
      sort-by="sort"
      sort-asc
      default-selections="languageId"
      no-removed-filter
      :delete-params="{mutation: deleteLanguage, idKey: 'languageId', isRowEnabled: isDeletionEnabled}"
      :skeleton-rows-count="3"
      :footer-props="{ itemsPerPageOptions: [5, 20, 40] }"
    >
      <template #[`item.statistics`]="{item}">
        <v-btn
          depressed
          text
          color="primary"
          small
          @click="selectedItem = item; isStatisticsDialogOpened = true;"
        >
          Show stats
        </v-btn>
      </template>
      <template #[`item.sort`]="{item}">
        <div class="d-flex flex-column">
          <v-btn
            icon
            color="black"
            x-small
            :loading="sortLoadingMap[`${item.id}_up`]"
            :disabled="item.sort <= 1 || isSortSaving"
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
            :loading="sortLoadingMap[`${item.id}_down`]"
            :disabled="item.sort >= languagesCount || isSortSaving"
            @click.prevent.stop="moveRow(item, 1)"
          >
            <v-icon small>
              mdi-arrow-down
            </v-icon>
          </v-btn>
        </div>
      </template>
      <template #[`item.isDefault`]="{item}">
        <favourite-checkbox
          :value="item.isDefault"
          :loading="defaultsMap[item.languageId]"
          @input="selectDefault(item)"
        />
      </template>
    </hasura-table>

    <v-dialog
      v-model="isNewItemDialogOpened"
      max-width="400"
      persistent
    >
      <hasura-form
        v-if="isNewItemDialogOpened"
        ref="form"
        source="SiteLanguageBridge"
        :fields="fields"
        :value="defaultItem"
        :mutation="createLanguage"
        @submit="onSubmit"
      >
        <template #title>
          Language selection
        </template>
        <template #actions="{isNew, isSaving, submit}">
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="isNewItemDialogOpened = false">
              Cancel
            </v-btn>
            <v-btn color="primary" :loading="isSaving" @click="submit">
              {{ isNew ? 'Save' : 'Create' }}
            </v-btn>
          </v-card-actions>
        </template>
      </hasura-form>
    </v-dialog>

    <v-dialog
      v-model="isStatisticsDialogOpened"
      max-width="900"
      persistent
    >
      <v-card v-if="isStatisticsDialogOpened">
        <v-card-title class="d-flex align-center">
          Statistics {{ selectedDate ? `: ${this.$moment(selectedDate).format('DD MMM')}`: '' }}
          <div class="ml-auto" style="width: 160px">
            <date-field v-model="selectedDate" clearable label="Filter by date" />
          </div>
        </v-card-title>
        <v-card-text v-if="!!allLanguages.length">
          <line-chart
            v-if="!resetChart"
            :data="getChartData()"
            :options="getChartOptions()"
            style="height: 500px;"
          />
        </v-card-text>
        <v-card-text v-else class="d-flex justify-center pt-10">
          <v-progress-circular indeterminate width="2" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="isStatisticsDialogOpened = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { HasuraTable } from 'vuetify-hasura-table'
import { HasuraForm } from 'vuetify-hasura-form'
import DateField from 'vuetify-schema-form/src/components/DateField'
import { mapActions } from 'vuex'
import { gql } from 'graphql-tag'
import LineChart from './LineChart'
import FavouriteCheckbox from '~/components/FavouriteCheckbox'

export default {
  components: {
    HasuraTable,
    HasuraForm,
    FavouriteCheckbox,
    LineChart,
    DateField
  },
  props: {
    siteId: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    statistics: {
      type: Boolean,
      default: false
    }
  },
  apollo: {
    allLanguages: {
      query: gql`query Get($siteId: uuid!) {
        allLanguages: SiteLanguageBridge(where: {siteId: {_eq: $siteId}}) {
          languageId
          clients {
            id
            created_at
            events {
              id
              created_at
              type
            }
          }
        }
      }`,
      variables () {
        return {
          siteId: this.siteId
        }
      },
      skip () {
        return !this.siteId || !this.isStatisticsDialogOpened
      }
    },
    $subscribe: {
      languagesCount: {
        query: gql`subscription GetCount($itemId: uuid!) {
          SiteLanguageBridge_aggregate(where: { siteId: { _eq: $itemId } }) {
            aggregate {
              count
            }
          }
        }`,
        variables () {
          return {
            itemId: this.siteId
          }
        },
        result ({ data }) {
          this.languagesCount = data.SiteLanguageBridge_aggregate.aggregate.count
        },
        skip () {
          return !this.siteId
        }
      }
    }
  },
  data () {
    return {
      resetChart: false,
      selectedDate: null,
      allLanguages: [],
      selectedItem: null,
      isStatisticsDialogOpened: false,
      isSortSaving: false,
      sortLoadingMap: {},
      languagesCount: 0,
      defaultsMap: {},
      isNewItemDialogOpened: false,
      fields: [
        {
          label: 'Language',
          value: 'languageId',
          type: 'remote',
          query: 'Language { id name }',
          itemText: 'name',
          itemValue: 'id',
          required: true,
          fetchAll: true,
          filter: () => ({
            _not: { sites: { siteId: { _eq: this.siteId } } }
          })
        }
      ]
    }
  },
  computed: {
    defaultItem () {
      return {
        sort: this.languagesCount + 1
      }
    },
    headers () {
      return [
        ...!this.statistics
          ? [
            { text: 'Sort', value: 'sort', width: 24, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 }, sortable: false },
            { text: 'Default', value: 'isDefault', width: 24, skeleton: { type: 'button', maxWidth: 24, maxHeight: 24 }, sortable: false }
          ] : [],
        { text: 'Language', value: 'language { id *name* }', sortable: false },
        { text: 'Statistics', value: 'statistics', selectable: false, sortable: false }
      ]
    }
  },
  watch: {
    selectedDate (val) {
      this.resetChart = true
      this.$nextTick(() => {
        this.resetChart = false
      })
    }
  },
  methods: {
    ...mapActions(['refreshCache']),
    getChartData () {
      const groupByDate = items => items
        .filter(item => !this.selectedDate || this.$moment(item.created_at).format('YYYY-MM-DD') === this.selectedDate)
        .reduce((acc, item) => {
          const key = this.$moment(item.created_at).format(this.selectedDate ? 'YYYY-MM-DD HH' : 'YYYY-MM-DD')

          acc[key] = acc[key] || []
          acc[key].push(item)

          return acc
        }, {})

      const clients = this.selectedItem ? this.allLanguages.find(x => x.languageId === this.selectedItem.languageId).clients : this.allLanguages.map(x => x.clients).flat()

      const uniqueViewersData = groupByDate(clients)
      const viewersData = groupByDate(clients.map(x => x.events.filter(e => e.type === 'initial').map(e => e)).flat())
      const videoViewData = groupByDate(clients.map(x => x.events.filter(e => e.type === 'VIDEO').map(e => e)).flat())
      const audioViewData = groupByDate(clients.map(x => x.events.filter(e => e.type === 'AUDIO').map(e => e)).flat())

      const buildChartData = (itemsMap) => {
        if (this.selectedDate) {
          const hours = [...new Array(24).keys()].map(x => x.toString().padStart(2, '0'))
          return hours.map((hour) => {
            const date = `${this.selectedDate} ${hour}`
            return ({ x: this.$moment(date, 'YYYY-MM-DD HH').toISOString(), y: itemsMap[date] ? itemsMap[date].length : 0 })
          })
        }

        const minDate = this.$moment.min([...Object.keys(uniqueViewersData), ...Object.keys(viewersData), ...Object.keys(videoViewData), ...Object.keys(audioViewData)].map(item => this.$moment(item)))
        const maxDate = this.$moment().startOf('day')
        const days = [...new Array(maxDate.diff(minDate, 'days') + 1).keys()].map(offset => minDate.clone().add(offset, 'days').format('YYYY-MM-DD'))

        return days.map(day => ({ x: this.$moment(day).toISOString(), y: itemsMap[day] ? itemsMap[day].length : 0 }))
      }

      return {
        datasets: [
          {
            label: 'Viewers',
            borderColor: '#2ab7ca',
            backgroundColor: '#2ab7ca',
            fill: false,
            data: buildChartData(viewersData)
          }, {
            label: 'Unique viewers',
            borderColor: '#fe4a49',
            backgroundColor: '#fe4a49',
            fill: false,
            data: buildChartData(uniqueViewersData)
          },
          {
            label: 'Video views',
            borderColor: '#005b96 ',
            backgroundColor: '#005b96',
            fill: false,
            data: buildChartData(videoViewData)
          },
          {
            label: 'Audio listeners',
            borderColor: '#651e3e',
            backgroundColor: '#651e3e',
            fill: false,
            data: buildChartData(audioViewData)
          }
        ]
      }
    },
    getChartOptions () {
      return {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        maintainAspectRatio: false,
        title: null,
        scales: {
          xAxes: [{
            type: 'time',
            display: true,
            position: 'bottom',
            scaleLabel: {
              display: true,
              labelString: 'Dates',
              fontColor: 'black'
            },
            time: {
              unit: this.selectedDate ? 'hour' : 'day'
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        }
      }
    },
    getViewersStats (clients) {
      const averagePerDaySet = Object.values(clients.reduce((acc, item) => {
        const key = this.$moment(item.created_at).format('DD.MM.YYYY')
        acc[key] = acc[key] || []

        acc[key].push(item)

        return acc
      }, {}))

      return {
        total: clients.length,
        averagePerDay: !averagePerDaySet.length ? 0 : Math.floor(averagePerDaySet.reduce((acc, { length }) => acc + length, 0) / averagePerDaySet.length)
      }
    },
    getViewerEventsStats (clients, eventType) {
      const allEvents = clients.map(x => x.events).flat().filter(x => x.type === eventType)

      return this.getViewersStats(allEvents)
    },
    isDeletionEnabled (row) {
      return !row.isDefault
    },
    async createLanguage ({ item }) {
      await this.$apollo.mutate({
        mutation: gql`mutation Insert($item: SiteLanguageBridge_insert_input!) {
          insert_SiteLanguageBridge_one(object: $item) {
            languageId
          }
        }`,
        variables: {
          item: {
            languageId: item.languageId,
            siteId: this.siteId,
            sort: this.languagesCount + 1,
            isDefault: false
          }
        }
      })

      return { id: null }
    },
    async deleteLanguage (languageId) {
      await this.$apollo.mutate({
        mutation: gql`mutation Delete($languageId: uuid!, $siteId: uuid!) {
          delete_SiteLanguageBridge_by_pk(languageId: $languageId, siteId: $siteId) {
            languageId
          }
        }`,
        variables: {
          languageId,
          siteId: this.siteId
        }
      })

      this.$nextTick(() => {
        this.refreshCache()
      })
      return { id: null }
    },
    async moveRow (item, direction) {
      try {
        this.sortLoadingMap[`${item.id}_${direction === 1 ? 'down' : 'up'}`] = true
        this.isSortSaving = true

        await this.$apollo.mutate({
          mutation: gql`mutation UpdateSort($where: SiteLanguageBridge_bool_exp!, $inc: Int!) {
            update_SiteLanguageBridge(where: $where, _inc: { sort: $inc }) {
              affected_rows
            }
          }`,
          variables: {
            where: {
              sort: { _eq: item.sort + direction },
              siteId: { _eq: this.siteId }
            },
            inc: -direction
          }
        })

        await this.$apollo.mutate({
          mutation: gql`mutation UpdateSort($languageId: uuid!, $siteId: uuid!, $inc: Int!) {
            update_SiteLanguageBridge_by_pk(pk_columns: { languageId: $languageId, siteId: $siteId }, _inc: { sort: $inc }) {
              languageId
            }
          }`,
          variables: {
            languageId: item.languageId,
            siteId: this.siteId,
            inc: direction
          }
        })

        this.$refs.table.$apollo.queries.items.refetch()
      } finally {
        this.sortLoadingMap[`${item.id}_${direction === 1 ? 'down' : 'up'}`] = false
        this.isSortSaving = false
      }
    },
    async selectDefault (item) {
      if (item.isDefault) {
        return
      }

      this.$set(this.defaultsMap, item.languageId, true)

      await this.$apollo.mutate({
        mutation: gql`mutation ResetDefault {
          update_SiteLanguageBridge(where: { siteId: {_eq: "${this.siteId}"}, isDefault: { _eq: true } }, _set: { isDefault: false }) {
            affected_rows
          }
        }`
      })

      await this.$apollo.mutate({
        mutation: gql`mutation SetDefault($languageId: uuid!, $siteId: uuid!) {
          update_SiteLanguageBridge_by_pk(pk_columns: { languageId: $languageId, siteId: $siteId }, _set: { isDefault: true }) {
            languageId
          }
        }`,
        variables: {
          languageId: item.languageId,
          siteId: this.siteId
        }
      })

      this.refreshCache()

      await new Promise(resolve => setTimeout(resolve, 500))
      this.$set(this.defaultsMap, item.languageId, false)
    },
    onSubmit () {
      this.refreshCache()

      this.isNewItemDialogOpened = false
    }
  }

}
</script>
