<template>
  <audio :src="src" controls />
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      default: null
    }
  }
}
</script>
