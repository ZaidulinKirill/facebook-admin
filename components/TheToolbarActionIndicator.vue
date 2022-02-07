<template>
  <v-tooltip bottom>
    <template #activator="{on}">
      <v-btn icon text :loading="loading || isRefreshing" v-on="on" @click="refreshCache">
        <v-icon>
          mdi-refresh
        </v-icon>
        <template #loader>
          <v-progress-circular indeterminate color="white" size="17" width="2" />
        </template>
      </v-btn>
    </template>
    Refresh
  </v-tooltip>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapState(['isRefreshing'])
  },
  mounted () {
    const watcher = this.$apollo.provider.watchLoading
    this.$apollo.provider.watchLoading = (isLoading, ...rest) => {
      this.loading = isLoading
      if (watcher) {
        watcher(isLoading, ...rest)
      }
    }
  },
  methods: {
    ...mapActions(['refreshCache'])
  }
}
</script>
