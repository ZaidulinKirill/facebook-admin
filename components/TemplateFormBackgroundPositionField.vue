<template>
  <v-text-field
    v-if="isActive"
    :value="selectedUnitValue"
    type="number"
    step="0.1"
    suffix="%"
    v-bind="$attrs"
    @input="onChange(selectedMode, $event, selectedUnit)"
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
      selectedUnit: '%',
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
        if (!val) {
          this.selectedUnitValue = 0
        } else if (typeof val === 'number') {
          this.selectedUnitValue = val
        } else if (val.endsWith('%')) {
          this.selectedUnitValue = parseFloat(val.replace('%', ''))
        } else {
          this.selectedUnitValue = parseFloat(val)
        }
      }
    },
    value: {
      handler (val) {
        if (!this.isActive) {
          this.$emit('change', { xs: val })
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange (mode, value, unit) {
      this.$emit('change', {
        ...this.value,
        [mode]: `${value}${unit}`
      })
    }
  }
}
</script>
