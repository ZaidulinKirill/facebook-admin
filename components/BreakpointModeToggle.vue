<template>
  <v-tooltip bottom open-delay="300">
    <template #activator="{on}">
      <v-btn icon height="26" width="26" v-on="on" @click.stop.prevent="toggleMode">
        <v-icon small>
          {{ selectedMode.icon }}
        </v-icon>
      </v-btn>
    </template>
    {{ selectedMode.text }}
  </v-tooltip>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: 'xs'
    }
  },
  data () {
    return {
      modes: [
        { value: 'xs', text: 'Phone', icon: 'mdi-cellphone' },
        { value: 'sm', text: 'Tablet', icon: 'mdi-tablet' },
        { value: 'md', text: 'Desktop', icon: 'mdi-desktop-mac' }
      ]
    }
  },
  computed: {
    selectedMode () {
      return this.modes.find(x => x.value === this.value)
    },
    selectedModeIndex () {
      return this.modes.indexOf(this.selectedMode)
    }
  },
  methods: {
    toggleMode () {
      const nextIndex = (this.selectedModeIndex + 1) % this.modes.length
      this.selectedModeValue = this.modes[nextIndex].value

      this.$emit('input', this.selectedModeValue)
    }
  }
}
</script>
