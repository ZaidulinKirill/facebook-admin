<template>
  <div class="d-flex align-center pa-5">
    <v-btn icon class="mr-0" :loading="loading" @click="goBack">
      <v-icon>mdi-keyboard-backspace</v-icon>
    </v-btn>
    <v-breadcrumbs :items="items" class="mb-0 pb-0 pa-0 pl-4" />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    goBack () {
      this.loading = true
      setTimeout(() => { this.loading = false }, 3000)
      this.$router.back()
    }
  }
}
</script>
