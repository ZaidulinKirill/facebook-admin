<template>
  <v-btn v-if="value" icon :disabled="readonly" :loading="loading" @click="$emit('input', editable ? false : true)">
    <v-icon color="#ff9800">
      mdi-star
    </v-icon>
  </v-btn>
  <v-tooltip v-else bottom>
    <template #activator="{on}">
      <v-btn icon :loading="loading" v-on="on" @click="$emit('input', true)">
        <v-icon color="gray">
          mdi-star-outline
        </v-icon>
      </v-btn>
    </template>
    {{ activateLabel }}
  </v-tooltip>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    activateLabel: {
      type: String,
      default: 'Make default'
    },
    editable: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
