<template>
  <v-row class="pb-2">
    <template v-if="languageSpecificVariables.length">
      <v-col v-for="language in languages" :key="language.id" cols="12" :md="languages.length > 1 ? 6 : 12">
        <h4 v-if="languageSpecificVariables.length" class="mb-4">
          {{ language.name }}

          <v-tooltip v-if="enableCloning && !clonedLanguage" bottom>
            <template #activator="{on}">
              <v-btn
                icon
                class="ml-2"
                color="primary"
                v-on="on"
                @click="clonedLanguage = language"
              >
                <v-icon>
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </template>
            Copy
          </v-tooltip>
          <v-tooltip v-if="enableCloning && clonedLanguage" bottom>
            <template #activator="{on}">
              <v-btn
                icon
                class="ml-2"
                color="primary"
                :disabled="clonedLanguage === language"
                v-on="on"
                @click="pasteLanguage(language)"
              >
                <v-icon>
                  mdi-content-paste
                </v-icon>
              </v-btn>
            </template>
            Paste
          </v-tooltip>
        </h4>
        <schema-form
          :ref="`form-${language.id}`"
          v-model="clone"
          :fields="getLanguageSpecificVariables(language)"
          @submit="onSubmit"
        />
      </v-col>
    </template>
    <v-col v-if="sharedVariables.length" cols="12" class="pt-0">
      <h4 v-if="languageSpecificVariables.length" class="mb-4">
        All languages
      </h4>
      <schema-form
        ref="form"
        v-model="clone"
        :fields="sharedVariables"
        @submit="onSubmit"
      />
    </v-col>

    <v-snackbar
      v-if="clonedLanguage"
      :value="!!clonedLanguage"
    >
      Language copied
      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="clonedLanguage = null"
        >
          Cancel
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="isPasted"
      timeout="2000"
    >
      Pasted successfully!
    </v-snackbar>
  </v-row>
</template>
<script>
import { SchemaForm } from 'vuetify-schema-form'

export default {
  components: {
    SchemaForm
  },
  props: {
    value: {
      type: Object,
      required: true
    },
    variables: {
      type: Array,
      required: true
    },
    languages: {
      type: Array,
      required: true
    },
    sync: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      clonedLanguage: null,
      clone: {},
      selectedTab: 0,
      reset: false,
      isPasted: false
    }
  },
  computed: {
    enableCloning () {
      return this.languageSpecificVariables.length > 0 && this.languages.length > 1
    },
    allVariables () {
      return this.variables.map(x => ({ ...x, languages: this.languages }))
    },
    sharedVariables () {
      return this.allVariables.filter(x => !x.language)
    },
    languageSpecificVariables () {
      return this.allVariables.filter(x => x.language)
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.clone = JSON.parse(JSON.stringify(val))
      }
    },
    languageSpecificVariables: {
      immediate: true,
      handler () {
        this.languages.forEach((language) => {
          const variables = this.languageSpecificVariables.map(x => ({ ...x, languageValue: `${x.value}_${language.id}` }))
          variables.forEach((variable) => {
            if (this.value[variable.value] !== undefined && this.value[variable.languageValue] === undefined) {
              this.$set(this.clone, variable.languageValue, this.value[variable.value])
            }
          })
        })
      }
    }
  },
  methods: {
    pasteLanguage (language) {
      this.languageSpecificVariables.forEach((field) => {
        this.$set(this.clone, `${field.value}_${language.id}`, this.clone[`${field.value}_${this.clonedLanguage.id}`] || this.clone[field.value])
      })
      this.isPasted = true
      this.clonedLanguage = null
    },
    submit () {
      this.submitsCount = 0

      if (this.sharedVariables.length) {
        this.$refs.form.submit()
      }

      if (this.languageSpecificVariables.length) {
        this.languages.forEach((language) => {
          this.$refs[`form-${language.id}`][0].submit()
        })
      }
    },
    onSubmit () {
      this.submitsCount += 1

      if (this.submitsCount >= ((this.languageSpecificVariables.length ? this.languages.length : 0) + (this.sharedVariables.length ? 1 : 0))) {
        this.$emit('submit', this.clone)
      }
    },
    getLanguageSpecificVariables (language) {
      return this.languageSpecificVariables.map(x => ({ ...x, value: `${x.value}_${language.id}` }))
    }
  }
}
</script>
