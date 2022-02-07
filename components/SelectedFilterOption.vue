<template>
  <div class="select-option">
    <autocomplete-field
      v-if="value.type === 'select'"
      :label="filter.name"
      v-bind="filter"
      dense
      style="height: 30px"
      outlined
      @input="$emit('input', {...value, selected: $event})"
    >
      <template #append>
        <v-tooltip bottom>
          <template #activator="{on}" class="pb-3">
            <v-btn icon v-on="on" @click.stop="$emit('remove')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          Remove filter
        </v-tooltip>
      </template>
    </autocomplete-field>
    <autocomplete-field
      v-else-if="filter.type !== 'remote'"
      :label="filter.name"
      multiple
      v-bind="filter"
      dense
      style="height: 30px"
      outlined
      @input="$emit('input', {...value, selected: $event})"
    >
      <template #append>
        <v-tooltip bottom>
          <template #activator="{on}" class="pb-3">
            <v-btn icon v-on="on" @click.stop="$emit('remove')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          Remove filter
        </v-tooltip>
      </template>
    </autocomplete-field>
    <apollo-remote-autocomplete
      v-else
      :label="filter.name"
      v-bind="filter"
      dense
      style="height: 30px"
      outlined
      @input="$emit('input', {...value, selected: $event})"
    >
      <template #append>
        <v-tooltip bottom>
          <template #activator="{on}" class="pb-3">
            <v-btn icon v-on="on" @click.stop="$emit('remove')">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          Remove filter
        </v-tooltip>
      </template>
    </apollo-remote-autocomplete>
  </div>
</template>
<script>
import { ApolloRemoteAutocomplete, AutocompleteField } from 'vuetify-schema-form/src/components'
export default {
  components: {
    AutocompleteField,
    ApolloRemoteAutocomplete
  },
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    filter () {
      const { value, ...rest } = this.value
      return rest
    }
  }
}
</script>
<style>
.select-option .v-input__append-inner {
  margin-top: 2px !important;
}
</style>
