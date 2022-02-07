<template>
  <div style="height: 700px" />
</template>
<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'

export default {
  props: {
    value: {
      type: [Object, Array],
      required: true
    },
    schema: {
      type: Object,
      default: null
    },
    schemaRefs: {
      type: Object,
      default: null
    }
  },
  mounted () {
    const container = this.$el

    const options = {
      mode: 'code',
      modes: ['code', 'tree'],
      schema: this.schema,
      schemaRefs: this.schemaRefs,
      onChange: (value) => {
        try {
          const json = editor.get()
          this.$emit('input', json)
        } catch {

        }
      }
    }

    const editor = new JSONEditor(container, options)
    editor.set(this.value)
  }
}
</script>
