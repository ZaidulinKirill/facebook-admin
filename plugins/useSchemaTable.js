import Vue from 'vue'
// eslint-disable-next-line import/named
import VuetifySchemaTable, { types } from 'vuetify-schema-table'
import { ImageCell } from 'vuetify-schema-table/src/components'
import SimpleAudioPlayer from '~/components/SimpleAudioPlayer.vue'

export default () => {
  Vue.use(VuetifySchemaTable, {
    types: {
      ...types,
      image: {
        component: ImageCell,
        postProcessProps: ({ props, item }) => {
          return { props: { ...props } }
        }
      },
      audio: {
        component: SimpleAudioPlayer,
        postProcessProps: ({ props, item }) => {
          return { props: { src: `/api/uploads/${item.src}?range=true`, controls: true } }
        }
      }
    }
  })
}
