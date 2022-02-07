<template>
  <v-dialog
    v-model="showAlert"
    width="400"
    :persistent="persistent"
    z-index="100"
  >
    <v-card>
      <v-card-text class="pa-2">
        <v-alert
          :type="(alert || {}).type || 'success'"
          class="mb-0"
          prominent
          colored-border
          border="right"
        >
          {{ alertMessage }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          dark
          block
          @click="showAlert=null;(alert || {}).action && (alert || {}).action();"
        >
          {{ (alert || {}).actionText || 'Хорошо' }}
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
    ...mapState(['alert', 'isAlertShown']),
    alertMessage () {
      return this.alert && this.alert.message
    },
    showAlert: {
      get () {
        return this.isAlertShown
      },
      set (val) {
        this.HIDE_ALERT(val)
      }
    }
  },
  methods: {
    ...mapMutations(['HIDE_ALERT'])
  }
}
</script>
