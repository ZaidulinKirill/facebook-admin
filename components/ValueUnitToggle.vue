<template>
  <v-tooltip bottom open-delay="300">
    <template #activator="{on}">
      <v-btn icon height="26" width="26" v-on="on" @click.stop.prevent="toggleMode">
        {{ selectedMode.label }}
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
      default: 'tp'
    }
  },
  data () {
    return {
      modes: [
        { value: 'tp', text: 'Points', label: 'pt' },
        // { value: 'px', text: 'Pixels', label: 'px' },
        { value: '%', text: 'Percents', label: '%' }
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
