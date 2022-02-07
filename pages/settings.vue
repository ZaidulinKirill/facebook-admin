<template>
  <v-row class="fill-height" no-gutters>
    <v-col cols="12">
      <v-card>
        <v-card-title>Settings</v-card-title>
        <v-card-text>
          <hasura-form
            v-model="item"
            class="no-title"
            source="Settings"
            :fields="fields"
            primary-key="id"
            primary-key-type="String!"
            item-id="main"
            flat
            @submit="onSubmit"
          >
            <template #title />
            <template
              #actions="{isSaving, submit}"
            >
              <fab-button
                tooltip="Save"
                dark
                icon="mdi-content-save"
                :loading="isSaving"
                @click="submit"
              />
            </template>
          </hasura-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { HasuraForm } from 'vuetify-hasura-form'
import FabButton from '~/components/FabButton'

export default {
  components: {
    FabButton,
    HasuraForm
  },
  data () {
    return {
      item: {},
      fields: [
        { label: 'Trimming threshold', value: 'trimmingThreshold', type: 'number', suffix: 'dB', md: 4, lg: 2 },
        { label: 'Normalization level', value: 'normalizationLevel', type: 'number', suffix: 'dB', md: 4, lg: 2 },
        { label: 'Highpass filter', value: 'highpassFilter', type: 'number', suffix: 'Hz', md: 4, lg: 2 },
        { label: 'Enable compression', value: 'enableCompression', type: 'checkbox', md: 4, lg: 2 },
        { label: 'Compression filter', value: 'compand', md: 4, lg: 2, if: ({ item }) => item.enableCompression }
      ]
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions(['refreshCache']),
    onSubmit () {
      this.refreshCache()
    }
  }
}
</script>
