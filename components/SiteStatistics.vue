<template>
  <div>
    <h3>
      Statistics
    </h3>
    <line-chart :data="chartData" :options="chartOptions" style="height: 300px;" />
    <!-- {{ site }} -->
  </div>
</template>
<script>

import { gql } from 'graphql-tag'
import LineChart from './LineChart'

export default {
  components: {
    LineChart
  },
  props: {
    siteId: {
      type: String,
      default: null
    }
  },
  apollo: {
    site: {
      query: gql`query Get($id: uuid!) {
        site: Site_by_pk(id: $id) {
          id
          languages {
            clients {
              id
              created_at
              events {
                id
                type
                created_at
              }
            }
          }
        }
      }`,
      variables () {
        return {
          id: this.siteId
        }
      },
      skip () {
        return !this.siteId
      }
    }
  },
  data () {
    return {
      site: null
    }
  },
  computed: {
    chartData () {
      return {
        datasets: [{
          label: 'Température',
          borderColor: 'red',
          backgroundColor: 'red',
          fill: false,
          data: [{
            x: '2020-07-05T15:38:47.933711',
            y: 2.8224692
          },
          {
            x: '2020-07-05T15:48:47.490669',
            y: 33.63129
          },
          {
            x: '2020-07-05T15:58:48.182698',
            y: 40.540405
          },
          {
            x: '2020-07-05T16:08:47.829882',
            y: 3.0312533
          },
          {
            x: '2020-07-05T16:18:47.489026',
            y: 49.145626
          }
          ]
        },
        {
          label: 'Humidité',
          borderColor: 'blue',
          backgroundColor: 'blue',
          fill: false,
          data: [{
            x: '2020-07-05T15:38:47.933711',
            y: 33.980587
          },
          {
            x: '2020-07-05T15:48:47.490669',
            y: 2.0313625
          },
          {
            x: '2020-07-05T15:58:48.182698',
            y: 24.249685
          },
          {
            x: '2020-07-05T16:08:47.829882',
            y: 7.4426904
          },
          {
            x: '2020-07-05T16:18:47.489026',
            y: 2.6335742
          },
          {
            x: '2020-07-05T16:28:48.175547',
            y: 25.92827
          }
          ]
        }
        ]
      }
    },
    chartOptions () {
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
            id: 'xAxeTime',
            scaleLabel: {
              display: true,
              labelString: 'Dates',
              fontColor: 'black'
            },
            time: {
              unit: 'minute',
              // "parser": "moment.ISO_8601", -> remove this line
              tooltipFormat: 'll'
            }
          }],
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Count'
            }
          }]
        }
      }
    }
  },
  methods: {

  }
}
</script>
