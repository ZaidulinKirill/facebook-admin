<template>
  <v-row class="fill-height no-title" no-gutters>
    <!-- <v-col cols="12">
      <v-card class="fill-height" style="padding-bottom: 0px !important">
        <v-card-title class="mb-0 pb-0">
          <the-breadcrumbs :items="breadcrumbSections" />
          <v-spacer />
        </v-card-title>
        <v-card-text>
          <page-module-language-edit-form
            :page-module-language-id="$nuxt.$route.params.id"
            @submit="onSubmit"
          />
        </v-card-text>
      </v-card>
    </v-col> -->
  </v-row>
</template>
<script>
// import { mapActions } from 'vuex'
// import { gql } from 'graphql-tag'
// import TheBreadcrumbs from '~/components/TheBreadcrumbs'
// import PageModuleLanguageEditForm from '~/components/PageModuleLanguageEditForm'

// export default {
//   transition (to, from) {
//     if (from && (from.name === 'pages-id' || from.name === 'sites-id')) {
//       return 'slide-right'
//     }

//     return 'slide-left'
//   },
//   components: {
//     TheBreadcrumbs,
//     PageModuleLanguageEditForm
//   },
//   apollo: {
//     site: {
//       query: gql`query GetPageLanguage($itemId: uuid!) {
//         site: PageModuleLanguage_by_pk(id: $itemId) {
//           id
//           language { id name }
//           pageModule {
//             id
//             page {
//               id
//               site {
//                 id
//                 subdomain
//               }
//             }
//           }
//         }
//       }`,
//       variables () {
//         return {
//           itemId: this.$nuxt.$route.params.id
//         }
//       }
//     }
//   },
//   data () {
//     return {
//       site: null
//     }
//   },
//   computed: {
//     breadcrumbSections () {
//       return [
//         { text: 'Sites', to: '/sites', exact: true },
//         ...this.site ? [
//           { text: this.site.pageModule.page.site.subdomain, to: `/sites/${this.site.pageModule.page.site.id}`, exact: true },
//           { text: this.site.language.name, disabled: true }
//         ] : []
//       ]
//     }
//   },
//   methods: {
//     ...mapActions(['refreshCache']),
//     onSubmit () {
//       this.refreshCache()
//     }
//   },
//   beforeRouteLeave (to, from, next) {
//     const keepState = false
//     if (!keepState) {
//       this.$destroy()
//     }

//     next()
//   }
// }
</script>
