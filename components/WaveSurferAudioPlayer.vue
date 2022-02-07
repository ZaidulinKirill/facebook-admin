<template>
  <div class="d-flex align-center">
    <v-btn icon color="primary" class="mr-1" @click="play">
      <v-icon>{{ !isPlaying ? 'mdi-play' : 'mdi-pause' }}</v-icon>
    </v-btn>
    <div class="flex-grow-1">
      <div class="waveform-container" />
    </div>
  </div>
</template>
<script>

import WaveSurfer from 'wavesurfer.js'
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    peaks: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      isPlaying: false
    }
  },
  mounted () {
    this.wavesurfer = WaveSurfer.create({
      container: this.$el.querySelector('.waveform-container'),
      fillParent: true,
      backend: 'MediaElement',
      // waveColor: '#2a3042',
      progressColor: '#2a3042',
      height: 40,
      barWidth: 2,
      barHeight: 0.7,
      normalize: true
    })

    this.wavesurfer.load(this.src, this.peaks ? this.peaks.data : null, 'none')
    this.wavesurfer.on('finish', () => {
      this.wavesurfer.pause()
      this.wavesurfer.seekTo(0)
      this.isPlaying = false
    })
  },
  methods: {
    play () {
      if (this.wavesurfer) {
        if (!this.isPlaying) {
          this.wavesurfer.play()
          this.isPlaying = true
        } else {
          this.wavesurfer.stop()
          this.isPlaying = false
        }
      }
    }
  }
}
</script>
<style>
.waveform-container {
  width: 150px
}

@media (min-width: 1600px) {
  .waveform-container {
    width: 150px
  }
}

.waveform-container wave {
  overflow-x: hidden !important;
}
</style>
