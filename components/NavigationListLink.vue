<template>
  <v-tooltip right :disabled="!showTooltip">
    <template #activator="{on}">
      <v-list-item
        :to="to"
        router
        link
        :disabled="disabled"
        @click="click"
        v-on="on"
      >
        <v-list-item-icon v-if="icon">
          <v-icon :color="error ? 'error' : ''">
            {{ icon }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="text" />
        </v-list-item-content>
      </v-list-item>
    </template>
    {{ text }}
  </v-tooltip>
</template>
<script>
export default {
  props: {
    to: {
      type: String,
      required: false,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    text: {
      type: String,
      required: true
    },
    showTooltip: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
