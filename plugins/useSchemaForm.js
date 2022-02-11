import Vue from 'vue'
// eslint-disable-next-line import/named
import VuetifySchemaForm, { types } from 'vuetify-schema-form'
import { VTextField } from 'vuetify/lib/components'
import TemplateFormArrayField from '~/components/TemplateFormArrayField'
import TemplateFormBackgroundPositionField from '~/components/TemplateFormBackgroundPositionField'
import TemplateFormColorField from '~/components/TemplateFormColorField'
import TemplateFormFontField from '~/components/TemplateFormFontField'
import TemplateFormFontSizeField from '~/components/TemplateFormFontSizeField'
import TemplateFormFormField from '~/components/TemplateFormFormField'
import TemplateFormMarginField from '~/components/TemplateFormMarginField'
import TemplateFormResponsiveSelectField from '~/components/TemplateFormResponsiveSelectField'
import TemplateFormResponsiveTextField from '~/components/TemplateFormResponsiveTextField'

export default () => {
  Vue.use(VuetifySchemaForm, {
    types: {
      ...types,
      image: types.file,
      images: types.files,
      color: {
        component: TemplateFormColorField
      },
      video: {
        component: VTextField,
        postProcessProps: ({ props }) => ({
          props: {
            ...props,
            placeholder: 'Youtube/Vimeo/Facebook or other video link'
          }
        })
      },
      html: {
        ...types.html,
        postProcessProps: ({ props }) => {
          const newProps = {
            ...props,
            height: 250,
            preInit: options => ({
              ...options,
              toolbar: 'undo redo | bold italic underline strikethrough | formatselect | alignleft aligncenter alignright alignjustify | numlist bullist | forecolor backcolor | link',
              quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
              contextmenu: 'link',
              convert_urls: false
            })
          }

          return {
            props: newProps,
            attrs: newProps
          }
        }
      },
      array: {
        component: TemplateFormArrayField
      },
      form: {
        component: TemplateFormFormField
      },
      font: {
        component: TemplateFormFontField,
        postProcessProps: ({ props }) => {
          const newProps = {
            ...props,
            query: 'Font { id name }',
            itemText: 'name',
            itemValue: 'name'
          }

          return {
            props: newProps,
            attrs: newProps
          }
        }
      },
      margin: {
        component: TemplateFormMarginField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      },
      size: {
        component: TemplateFormMarginField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      },
      fontSize: {
        component: TemplateFormFontSizeField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      },
      'responsive-select': {
        component: TemplateFormResponsiveSelectField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      },
      'responsive-text': {
        component: TemplateFormResponsiveTextField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      },
      'background-position': {
        component: TemplateFormBackgroundPositionField,
        postProcessProps: ({ props }) => {
          return { props, attrs: props }
        }
      }
    }
  })
}
