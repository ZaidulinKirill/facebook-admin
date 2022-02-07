<template>
  <div v-if="isLoading" class="d-flex h-100 align-center justify-center">
    <v-progress-circular indeterminate size="20" width="1" />
  </div>
  <div v-else>
    <ul style="list-style: auto;">
      <li v-for="item in items" :key="item.id" class="mt-1">
        {{ getSongName(item) }} {{ stage==='stage-1'? `(${item.voted} votes)`: '' }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    stage: {
      type: String,
      required: true
    },
    pageModuleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      items: [],
      isLoading: true
    }
  },
  async created () {
    this.items = await this.$axios.$get(`/api/songs/top?stage=${this.stage}&formModuleId=${this.pageModuleId}`)
    this.isLoading = false
  },
  methods: {
    getSongName (song) {
      return `${song.artistName} - ${song.trackName}`
    }
  }
}
</script>
