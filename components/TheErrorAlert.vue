<template>
  <v-dialog
    v-model="showError"
    :width="(error || {}).width || 300"
    :persistent="persistent"
    z-index="100"
  >
    <v-card>
      <v-card-text class="pa-2">
        <v-alert
          type="error"
          class="mb-0"
          prominent
          colored-border
          border="right"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          dark
          block
          @click="showError = null"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    persistent: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['error']),
    errorMessage () {
      return this.error && this.error.message
    },
    showError: {
      get () {
        return !!this.error
      },
      set (val) {
        this.SET_ERROR(val)
      }
    }
  },
  methods: {
    ...mapMutations(['SET_ERROR']),
    hideError () {
      this.showError = null
    }
  }
}
</script>
