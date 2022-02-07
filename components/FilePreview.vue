<template>
  <div class="pa-2" style="cursor: pointer;" @click="$emit('click')">
    <a v-if="type === 'image'" :href="`/api/uploads/${fileId}`" target="_blank" @click.stop.prevent="previewUrl = `/api/uploads/${fileId}`; previewType='image'">
      <img :src="`/api/uploads/w_130,h_130/${fileId}`">
    </a>
    <div v-else-if="type === 'video'">
      <video
        :src="`/api/uploads/${fileId}`"
        width="130"
        height="130"
        style="background-color: black;"
        @click.stop.prevent="previewUrl = `/api/uploads/${fileId}`; previewType='video'"
      />
    </div>
    <v-progress-circular
      v-else-if="type === 'unknown'"
      indeterminate
      :width="1"
    />
    <v-btn
      v-else
      text
      color="primary"
      :href="`/api/uploads/${fileId}`"
      target="_blank"
    >
      <v-icon class="mr-2">
        mdi-download
      </v-icon>
      Download
    </v-btn>
    <v-dialog persistent max-width="800" :value="!!previewUrl">
      <v-card>
        <v-card-title class="d-flex align-center">
          {{ previewType === 'image' ? 'Image preview' : 'Video preview' }}
          <v-btn
            class="ml-2"
            text
            color="primary"
            :href="`/api/uploads/${fileId}`"
            target="_blank"
            download="File"
          >
            <v-icon class="mr-2">
              mdi-download
            </v-icon>
            Download
          </v-btn>
          <v-spacer />
          <v-btn icon large @click="previewUrl = null">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <img v-if="previewType==='image'" :src="`/api/uploads/${fileId}`" width="100%">
          <video v-else :src="`/api/uploads/${fileId}`" width="100%" controls />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import isVideo from 'is-video'
import isImage from 'is-image'

export default {
  props: {
    fileId: {
      type: String,
      required: true
    },
    file: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      type: 'unknown',
      previewUrl: null,
      previewType: 'image'
    }
  },
  watch: {
    file (val) {
      const type = val.type.replace('.', '')

      if (isImage(`file.${type}`)) {
        this.type = 'image'
      } else if (isVideo(`file.${type}`)) {
        this.type = 'video'
      } else {
        this.type = type
      }
    }
  }
}
</script>
