<template>
  <v-text-field
    v-if="isActive"
    :value="selectedUnitValue"
    type="number"
    step="0.1"
    dense
    v-bind="$attrs"
    @input="onChange(selectedMode, $event, selectedUnit)"
  >
    <template #prepend-inner>
      <breakpoint-mode-toggle v-model="selectedMode" />
    </template>
    <template #append>
      <value-unit-toggle v-model="selectedUnit" @input="onChange(selectedMode, selectedUnitValue, $event)" />
    </template>
  </v-text-field>
</template>
<script>

import BreakpointModeToggle from './BreakpointModeToggle'
import ValueUnitToggle from './ValueUnitToggle'

export default {
  components: {
    BreakpointModeToggle,
    ValueUnitToggle
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
      selectedUnit: 'tp',
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
          this.selectedUnit = 'tp'
          this.selectedUnitValue = 0
        } else if (typeof val === 'number') {
          this.selectedUnit = 'tp'
          this.selectedUnitValue = val
        } else if (val.endsWith('px')) {
          this.selectedUnit = 'px'
          this.selectedUnitValue = parseFloat(val.replace('px', ''))
        } else if (val.endsWith('%')) {
          this.selectedUnit = '%'
          this.selectedUnitValue = parseFloat(val.replace('%', ''))
        } else {
          this.selectedUnit = 'tp'
          this.selectedUnitValue = parseFloat(val)
        }
      }
    },
    value: {
      handler (val) {
        if (!this.isActive) {
          this.$emit('change', { xs: parseFloat(val) || 0 })
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange (mode, value, unit) {
      this.$emit('change', {
        ...this.value,
        [mode]: unit === 'tp' ? parseFloat(value) : `${value}${unit}`
      })
    }
  }
}
</script>
