<template>
  <v-row class="fill-height " no-gutters>
    <v-col cols="12">
      <v-card class="fill-height">
        <v-card-title>
          Media files
        </v-card-title>
        <v-card-text>
          <v-tabs
            v-model="tab"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab>
              <v-icon class="mr-2">
                mdi-folder-multiple-image
              </v-icon>
              Images
            </v-tab>
            <v-tab>
              <v-icon class="mr-2">
                mdi-youtube
              </v-icon>
              Videos
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" class="flex-grow-1 mt-10">
            <v-tab-item>
              <v-row>
                <v-col v-for="image in images" :key="image" cols="12" md="2" class="d-flex align-center">
                  <a :href="`/api/uploads/${image}.png`" :download="`${image}.png`" target="_blank">
                    <img :src="`/api/uploads/w_500/${image}.png`" style="width:100%;border-radius: 8px;border:thin solid rgba(0,0,0,0.4);background:gray;">
                  </a>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <div class="d-flex justify-center mt-10 pt-10">
                <h2>No videos found</h2>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { gql } from 'graphql-tag'

export default {
  apollo: {
    site: {
      query: gql`query Get($id: uuid!) {
        site: Site_by_pk(id: $id) {
          id
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
          id: this.user.siteId
        }
      },
      skip () {
        return false
      }
    }
  },
  components: {
  },
  data () {
    return {
      tab: 0,
      site: null
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    images () {
      if (!this.site) {
        return []
      }

      function traverseVariables ({ model, variables }) {
        const images = variables.filter(variable => variable.type === 'image').map(variable => model[variable.value]).filter(x => !!x)

        const nestedImages = variables
          .filter(variable => variable.type === 'array')
          .map(
            variable => (model[variable.value] || [])
              .map(item => traverseVariables({ model: item, variables: variable.variables }))
              .flat()
          )
          .flat()

        return [
          ...images,
          ...nestedImages
        ]
      }

      return this.site.pages
        .map(
          page => page.modules.map(module => ({
            variables: module.module.variables,
            model: module.variables
          }))
        )
        .flat()
        .map(traverseVariables)
        .flat()
    }
  }
}
</script>
