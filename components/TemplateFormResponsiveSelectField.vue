<template>
  <v-select
    v-if="isActive"
    :value="selectedUnitValue"
    v-bind="$attrs"
    item-text="text"
    item-value="value"
    @input="onChange(selectedMode, $event)"
  >
    <template #prepend-inner>
      <breakpoint-mode-toggle v-model="selectedMode" />
    </template>
  </v-select>
</template>
<script>

import BreakpointModeToggle from './BreakpointModeToggle'

export default {
  components: {
    BreakpointModeToggle
  },
  props: {
    value: {
      type: null,
      default: null
    }
  },
  data () {
    return {
      selectedMode: 'xs',
      selectedUnitValue: null
    }
  },
  computed: {
    isActive () {
      return this.value !== null && typeof this.value === 'object'
    },
    selectedValue () {
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
          this.$emit('change', { xs: val })
        }
      },
      immediate: true
    }
  },
  methods: {
    onChange (mode, value) {
      this.$emit('change', {
        ...this.value,
        [mode]: value
      })
    }
  }
}
</script>
