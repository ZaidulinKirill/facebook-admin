<template>
  <v-text-field
    v-if="isActive"
    :value="selectedUnitValue"
    type="number"
    step="1"
    v-bind="$attrs"
    @input="onChange(selectedMode, $event)"
  >
    <template #prepend-inner>
      <breakpoint-mode-toggle v-model="selectedMode" />
    </template>
  </v-text-field>
</template>
<script>

import BreakpointModeToggle from './BreakpointModeToggle'

export default {
  components: {
    BreakpointModeToggle
  },
  props: {
    value: {
      type: [Number, Object],
      default: () => ({ tp: 0 })
    }
  },
  data () {
    return {
      selectedMode: 'xs',
      selectedUnitValue: 0
    }
  },
  computed: {
    isActive () {
      return this.value !== null && typeof this.value === 'object'
    },
    selectedValue () {
      if (!this.isActive) {
        return this.value
      }

      return this.value[this.selectedMode]
    }
  },
  watch: {
    selectedValue: {
      immediate: true,
      handler (val) {
        this.selectedUnitValue = val
      }
    },
    value: {
      handler (val) {
        if (!this.isActive) {
          this.$emit('change', { xs: val || 0 })
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange (mode, value) {
      this.$emit('change', {
        ...this.value,
        [mode]: parseFloat(value)
      })
    }
  }
}
</script>
