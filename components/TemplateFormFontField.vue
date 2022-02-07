<template>
  <v-autocomplete v-bind="$attrs" :items="user.fonts" @change="$emit('change', $event)">
    <template v-slot:selection="{item}">
      <span :style="`font-family: '${item.name}'`">
        {{ item.name }}
      </span>
    </template>
    <template v-slot:item="{item}">
      <span :style="`font-family: '${item.name}'`">
        {{ item.name }}
      </span>
    </template>
  </v-autocomplete>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isMenuOpened: false,
      color: null
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.color = { hex: val }
      }
    },
    isMenuOpened (val) {
      if (val) {
        this.color = { hex: this.value }
      }
    }
  }
}
</script>
<style scoped>
.color-rect {
  cursor: pointer;
  height: 30px;
  width: 64px;
  border: thin solid #cccccc;
  color: #aaaaaa;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
