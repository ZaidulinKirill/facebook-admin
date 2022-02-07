<template>
  <v-row>
    <v-col v-for="item in modules" :key="item.id" xs="12" md="3" lg="3">
      <v-card :ripple="false" @click="$emit('input', item.id)">
        <v-card-text class="no-scroll pa-0" style="overflow: hidden;height: 90px;overflow-y:scroll;border-bottom: thin solid #2a3042;">
          <img v-if="item.previewImage" :src="item.previewImage.url.replace('/uploads', '/uploads/w_400')" style="width: 100%; object-fit:cover;object-position:top;display:block;">
        </v-card-text>
        <v-card-actions class="d-flex justify-center py-1" :style="`${item.id === value ? `background-color: #2a3042; color: white;`: ''}`">
          <div class="d-flex justify-center align-center" :style="`${item.id === value ? `background-color: #2a3042; color: white;`: ''}`">
            {{ item.name }}
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>

import { gql } from 'graphql-tag'
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: null
    }
  },
  apollo: {
    modules: {
      query: gql`query GetItems($where: Module_bool_exp) {
        modules: Module(where: $where, order_by: {created_at: asc}) {
          id
          name
          previewImage {
            id
            url
          }
        }
      }`,
      variables () {
        return {
          where: {
            _or: [{ systemType: { _neq: 'head' } }, { systemType: { _is_null: true } }],
            ...this.tag && {
              tag: { _eq: this.tag }
            }
          }
        }
      },
      skip () {
        return false
      }
    }
  },
  data () {
    return {
      modules: []
    }
  },
  watch: {
    modules (items) {
      if (!this.value && items.length) {
        this.$emit('input', items[0].id)
      }
    }
  }
}
</script>
