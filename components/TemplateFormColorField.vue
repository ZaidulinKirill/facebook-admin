<template>
  <div class="d-flex align-center">
    <v-menu
      v-model="isMenuOpened"
      bottom
      right
      offset-x
      offset-y
      :disabled="disabled"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on }">
        <div class="mr-3 color-rect" :class="{active: !!value}" :style="value ? `background-color: ${value};` : `background-color: transparent;`" v-on="on">
          {{ !value ? 'Not set': '' }}
        </div>
      </template>
      <v-card>
        <v-color-picker
          v-model="color"
          :disabled="disabled"
          dot-size="25"
          show-swatches
          hide-canvas
          :swatches="colors.map(x => [x])"
          swatches-max-height="100"
        />
        <v-card-actions>
          <v-btn v-if="clearable" text @click="$emit('change', null);color = null;isMenuOpened = false">
            Clear
          </v-btn>
          <v-spacer />
          <v-btn color="primary" @click="isMenuOpened = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="isMenuOpened = false; $emit('change', typeof color === 'string' ? color : color.hex)">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
    <span style="font-size: 16px">{{ label }}</span>
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  apollo: {
    site: {
      query: gql`query GetSite($itemId: uuid!) {
        site: Site_by_pk(id: $itemId) {
          id
          primaryColor
          pages {
            id
            modules {
              id
              variables
              module {
                id
                variables
                systemType
              }
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
    }
  },
  data () {
    return {
      isMenuOpened: false,
      color: null,
      site: null
    }
  },
  computed: {
    siteId () {
      return this.$nuxt.$route.params.id
    },
    colors () {
      if (!this.site) {
        return []
      }

      function traverseVariables ({ model, variables }) {
        const colors = variables.filter(variable => variable.type === 'color').map(variable => model[variable.value]).filter(x => !!x)

        const nestedColors = variables
          .filter(variable => variable.type === 'array')
          .map(
            variable => (model[variable.value] || [])
              .map(item => traverseVariables({ model: item, variables: variable.variables }))
              .flat()
          )
          .flat()

        const nestedFormColors = variables
          .filter(variable => variable.type === 'form')
          .map(
            (variable) => {
              return (model[variable.value] || [])
                .map((item) => {
                  if (item.type === 'form-audio-recorder') {
                    return item.color
                  } else if (item.type === 'form-file-upload') {
                    return item.color
                  } else if (item.type === 'form-submit-button') {
                    return item.color
                  }
                })
            }
          )
          .flat()

        return [
          ...colors,
          ...nestedColors,
          ...nestedFormColors
        ]
      }

      return [...new Set(
        [
          this.site.primaryColor,
          ...this.site.pages
            .map(
              page => page.modules.map(module => ({
                variables: module.module.variables,
                model: module.variables
              }))
            )
            .flat()
            .map(traverseVariables)
            .flat()
        ].filter(x => !!x)
      )]
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.color = val
      }
    },
    isMenuOpened (val) {
      if (val) {
        this.color = this.value
      }
    }
  }
}
</script>
<style scoped>
.color-rect {
  cursor: pointer;
  height: 30px;
  width: 64px;
  border: thin solid #cccccc;
  color: #aaaaaa;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
