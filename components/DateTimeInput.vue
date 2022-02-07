<template>
  <div>
    <v-text-field />
  </div>
</template>
<script>
import { DateTimeField } from 'vuetify-schema-form/src/components'
export default {
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      required: true
    }
  }
}
</script>
