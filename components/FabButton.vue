<template>
  <v-tooltip left>
    <template #activator="{on}">
      <v-fab-transition>
        <v-btn
          v-show="isShown"
          fab
          fixed
          right
          :dark="dark"
          bottom
          :style="small ? 'margin-right:0px;margin-bottom:60px;': ''"
          :x-small="small"
          :loading="loading"
          :color="color"
          v-on="on"
          @click="$emit('click')"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    {{ tooltip }}
  </v-tooltip>
</template>
<script>
export default {
  props: {
    timeout: {
      type: Number,
      default: 100
    },
    icon: {
      type: String,
      default: 'add'
    },
    color: {
      type: String,
      default: 'primary'
    },
    tooltip: {
      type: String,
      default: 'Добавить'
    },
    dark: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShown: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.isShown = true
    }, this.timeout)
  }
}
</script>
