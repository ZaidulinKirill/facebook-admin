export const FormFields = {
  FILE_UPLOAD: 'form-file-upload',
  TEXT: 'form-input-field',
  SELECT: 'form-select-field',
  TEXTAREA: 'form-textarea-field',
  NUMBER: 'form-number-field',
  CHECKBOX: 'form-checkbox-field',
  RADIO: 'form-radio-field',
  SUBMIT_BUTTON: 'form-submit-button',
  BACK_BUTTON: 'form-back-button',
  SONG_SELECTION: 'form-song-selection',
  SONGS_TOP: 'form-songs-top',
  AUDIO_BUTTON: 'form-audio-recorder',
  SPACING: 'form-spacing',
  BLOCK_OF_TEXT: 'form-block-of-text',
  COLOR: 'form-color'
}

export const FormFieldsList = [
  { text: 'File upload', value: FormFields.FILE_UPLOAD },
  { text: 'Color', value: FormFields.COLOR },
  { text: 'Text', value: FormFields.TEXT },
  { text: 'Select', value: FormFields.SELECT },
  { text: 'Song selection', value: FormFields.SONG_SELECTION },
  { text: 'Top of the songs', value: FormFields.SONGS_TOP },
  { text: 'Textarea', value: FormFields.TEXTAREA },
  { text: 'Number', value: FormFields.NUMBER },
  { text: 'Checkbox', value: FormFields.CHECKBOX },
  { text: 'Radio group', value: FormFields.RADIO },
  { text: 'Audio', value: FormFields.AUDIO_BUTTON },
  { text: 'Submit button', value: FormFields.SUBMIT_BUTTON },
  { text: 'Spacing', value: FormFields.SPACING },
  { text: 'Block of text', value: FormFields.BLOCK_OF_TEXT },
  { text: 'Back button', value: FormFields.BACK_BUTTON }
]

const VariantTypes = {
  STANDARD: 'standard',
  CONTAINED: 'contained',
  OUTLINED: 'outlined',
  FILLED: 'filled',
  TEXT: 'text'
}

const InputVariants = [VariantTypes.STANDARD, VariantTypes.OUTLINED, VariantTypes.FILLED]
const ButtonVariants = [VariantTypes.CONTAINED, VariantTypes.OUTLINED, VariantTypes.TEXT]

const columns = [...[...new Array(10).keys()].map(x => x + 1)].map(x => ({
  value: x,
  text: x * 10
}))

const commonFields = onTypeChanged => [
  { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 6, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
  { label: 'Variant', value: 'variant', type: 'autocomplete', items: InputVariants, required: true, md: 6 },
  { label: 'Key', value: 'name', required: true, md: 6 }
]

const defaultPlacement = {
  xs: 10,
  md: 4,
  fullWidth: true
}

const alignments = [{ value: 'flex-start', text: 'Left' }, { value: 'center', text: 'Center' }, { value: 'flex-end', text: 'Right' }]

export const FormFieldsData = ({ onTypeChanged, languages }) => ({
  [FormFields.COLOR]: {
    fields: [
      { label: 'Key', value: 'name', required: true, md: 6 },
      { label: 'Label', value: 'label', required: true, language: true }
    ],
    default: {
      xs: 10,
      md: 10
    }
  },
  [FormFields.BLOCK_OF_TEXT]: {
    fields: [
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 4, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Text', value: 'text', type: 'textArea', outlined: true, required: true, language: true },
      { label: 'Font size', value: 'fontSize', type: 'number', md: 4, clearable: true, suffix: 'rem' },
      { label: 'Font weight', value: 'fontWeight', type: 'select', items: [{ value: 'normal', text: 'Normal' }, { value: 'bold', text: 'Bold' }], md: 4 },
      { label: 'Font color', value: 'fontColor', type: 'color', md: 3 },
      { label: 'Margin top', value: 'marginTop', type: 'number', md: 3 },
      { label: 'Font family', value: 'fontFamily', type: 'font', md: 6, clearable: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      fontWeight: 'normal',
      xs: 10,
      md: 10
    }
  },
  [FormFields.TEXT]: {
    fields: [
      ...commonFields(onTypeChanged),
      { label: 'Default', value: 'default', md: 6 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Autocomplete', value: 'autoComplete', md: 3 },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true },
      { label: 'Placeholder', value: 'placeholder', language: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.STANDARD,
      ...defaultPlacement
    }
  },
  [FormFields.SELECT]: {
    fields: [{
      type: 'tabs',
      grow: true,
      fields: [
        {
          type: 'row',
          icon: 'mdi-text-box-outline',
          label: 'General',
          fields: [
            ...commonFields(onTypeChanged),
            { label: 'Default', value: 'default', type: 'select', md: 6, items: ({ item }) => item.items || [], itemText: 'value', itemValue: 'value' },
            { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
            { label: 'Is required', value: 'required', type: 'checkbox', md: 3 }
            // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
          ]
        },
        {
          type: 'row',
          icon: 'mdi-format-list-bulleted',
          label: 'Options',
          fields: [
            {
              value: 'items',
              type: 'array',
              headers: [{ text: 'Label', value: 'text', language: true }, { text: 'Key', value: 'value' }],
              variables: [{ label: 'Label', value: 'text', language: true, required: true }, { label: 'Key', value: 'value', required: true }],
              languages
            }
          ]
        }
      ]
    },
    { label: 'Label', value: 'label', required: true, language: true },
    { label: 'Placeholder', value: 'placeholder', language: true }
    ],
    default: {
      variant: VariantTypes.STANDARD,
      items: [],
      ...defaultPlacement
    }
  },
  [FormFields.SONG_SELECTION]: {
    fields: [
      ...commonFields(onTypeChanged),
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true },
      { label: 'Placeholder text', value: 'placeholder', required: true, language: true },
      { label: 'No options text', value: 'noOptionsText', required: true, language: true },
      { label: 'Loading text', value: 'loadingText', required: true, language: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.STANDARD,
      items: [],
      noOptionsText: 'No data',
      loadingText: 'Loading...',
      placeholder: 'Enter song name',
      ...defaultPlacement
    }
  },
  [FormFields.SONGS_TOP]: {
    fields: [
      { label: 'Key', value: 'name', required: true, md: 6 },
      { label: 'Title', value: 'label', required: true, language: true },
      { label: 'Description', value: 'description', required: true, language: true },
      { label: 'Width', value: 'size', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Number of songs', value: 'numberOfSongs', required: true, type: 'number', md: 3 }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      label: 'Top of the songs',
      description: 'Reorder the list to match your preferences!',
      xs: 10,
      md: 10,
      size: 5,
      fullWidth: true,
      numberOfSongs: 5
    }
  },
  [FormFields.TEXTAREA]: {
    fields: [
      ...commonFields(onTypeChanged),
      { label: 'Default', value: 'default', md: 6 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Rows count', value: 'minRows', placeholder: 'auto', suffix: 'rows', type: 'int', md: 3 },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true },
      { label: 'Placeholder', value: 'placeholder', language: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.OUTLINED,
      minRows: 3,
      ...defaultPlacement
    }
  },
  [FormFields.NUMBER]: {
    fields: [
      ...commonFields(onTypeChanged),
      { label: 'Default', value: 'default', md: 6 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true },
      { label: 'Placeholder', value: 'placeholder', language: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.STANDARD,
      ...defaultPlacement
    }
  },
  [FormFields.CHECKBOX]: {
    fields: [
      { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 6, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
      { label: 'Variant', value: 'variant', type: 'autocomplete', items: InputVariants, md: 6, disabled: true },
      { label: 'Key', value: 'name', required: true, md: 6 },
      { label: 'Default', value: 'default', type: 'checkbox', md: 3 },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Label', value: 'label', type: 'textArea', required: true, language: true }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      default: false,
      ...defaultPlacement
    }
  },
  [FormFields.RADIO]: {
    fields: [{
      type: 'tabs',
      grow: true,
      fields: [
        {
          type: 'row',
          icon: 'mdi-text-box-outline',
          label: 'General',
          fields: [
            { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 6, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
            { label: 'Variant', value: 'variant', type: 'autocomplete', items: InputVariants, md: 6, disabled: true },
            { label: 'Key', value: 'name', required: true, md: 6 },
            { label: 'Default', value: 'default', type: 'select', md: 6, items: ({ item }) => item.items || [], itemText: 'value', itemValue: 'value', required: true },
            { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
            { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
            { label: 'Row?', value: 'row', type: 'checkbox', md: 3 }
            // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
          ]
        },
        {
          type: 'row',
          icon: 'mdi-format-list-bulleted',
          label: 'Options',
          fields: [
            {
              value: 'items',
              type: 'array',
              headers: [{ text: 'Label', value: 'text', language: true }, { text: 'Key', value: 'value' }],
              variables: [{ label: 'Label', value: 'text', language: true, required: true }, { label: 'Key', value: 'value', required: true }],
              languages
            }
          ]
        }
      ]
    },
    { label: 'Label', value: 'label', required: true, language: true }],
    default: {
      items: [],
      ...defaultPlacement,
      row: true
    }
  },
  [FormFields.AUDIO_BUTTON]: {
    fields: [
      { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 6, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
      { label: 'Variant', value: 'variant', type: 'autocomplete', items: ButtonVariants, required: true, md: 6 },
      { label: 'Key', value: 'name', required: true, md: 6 },
      { label: 'Color', value: 'color', type: 'color', required: true, md: 6 },
      { label: 'Margin top', value: 'marginTop', type: 'number', md: 3 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Alignment', value: 'alignment', type: 'select', items: alignments, required: true, md: 3 },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true, md: 6 },
      { label: 'Record Label', value: 'recordLabel', required: true, language: true, md: 6 },
      { label: 'Stop label', value: 'stopLabel', required: true, language: true, md: 6 },
      { label: 'Play label', value: 'playLabel', required: true, language: true, md: 6 },
      { label: 'Stop playing label', value: 'stopPlayingLabel', required: true, language: true, md: 6 }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.CONTAINED,
      recordLabel: 'Record',
      playLabel: 'Play',
      stopLabel: 'Stop',
      stopPlayingLabel: 'Stop',
      ...defaultPlacement,
      fullWidth: false,
      alignment: 'flex-start'
    }
  },
  [FormFields.SUBMIT_BUTTON]: {
    fields: [
      { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 3, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
      { label: 'Variant', value: 'variant', type: 'autocomplete', items: ButtonVariants, required: true, md: 3 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 2, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Alignment', value: 'alignment', type: 'select', items: alignments, required: true, md: 2 },
      { label: 'Color', value: 'color', type: 'color', required: true, md: 2 },
      { label: 'Margin top', value: 'marginTop', type: 'number', md: 3 },
      { label: 'Success message title', value: 'successMessageTitle', required: true, md: 6, language: true, if: ({ item }) => !item.isManual },
      { label: 'Success message button', value: 'successMessageButtonText', required: true, md: 6, language: true, if: ({ item }) => !item.isManual },
      { label: 'Success message', value: 'successMessage', type: 'textArea', rows: 2, language: true, outlined: true, if: ({ item }) => !item.isManual },
      { label: 'Label', value: 'label', required: true, language: true },
      { label: 'Is manual', value: 'isManual', type: 'checkbox', md: 3 }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      variant: VariantTypes.CONTAINED,
      label: 'Submit',
      ...defaultPlacement,
      fullWidth: false,
      successMessageButtonText: 'OK',
      successMessageTitle: 'Success',
      successMessage: '',
      alignment: 'flex-start'
    }
  },
  [FormFields.BACK_BUTTON]: {
    fields: [
      { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 3, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
      { label: 'Variant', value: 'variant', type: 'autocomplete', items: ButtonVariants, required: true, md: 3 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 2, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Alignment', value: 'alignment', type: 'select', items: alignments, required: true, md: 2 },
      { label: 'Color', value: 'color', type: 'color', required: true, md: 2 },
      { label: 'Margin top', value: 'marginTop', type: 'number', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true }
    ],
    default: {
      variant: VariantTypes.CONTAINED,
      label: 'Submit',
      ...defaultPlacement,
      fullWidth: false,
      alignment: 'flex-start'
    }
  },
  [FormFields.FILE_UPLOAD]: {
    fields: [
      { label: 'Field type', value: 'type', type: 'autocomplete', items: FormFieldsList, required: true, md: 6, '@input': ({ eventArgs }) => { onTypeChanged(eventArgs) } },
      { label: 'Variant', value: 'variant', type: 'autocomplete', items: ButtonVariants, required: true, md: 6 },
      { label: 'Key', value: 'name', required: true, md: 6 },
      { label: 'Color', value: 'color', type: 'color', required: true, md: 6 },
      { label: 'Margin top', value: 'marginTop', type: 'number', md: 3 },
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, md: 3, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Alignment', value: 'alignment', type: 'select', items: alignments, required: true, md: 3 },
      { label: 'Is required', value: 'required', type: 'checkbox', md: 3 },
      { label: 'Label', value: 'label', required: true, language: true, md: 6 },
      { label: 'Button label', value: 'uploadLabel', required: true, language: true, md: 6 },
      { label: 'Cancel recording label', value: 'cancelLabel', required: true, language: true, md: 6 },
      { label: 'Confirm recording label', value: 'confirmRecordingLabel', required: true, language: true, md: 6 },
      { label: 'Stop recording label', value: 'stopRecordingLabel', required: true, language: true, md: 6 },
      { label: 'Record video menu item', value: 'recordVideoMenuLabel', required: true, language: true, md: 6 },
      { label: 'Upload file menu item', value: 'uploadFileMenuLabel', required: true, language: true, md: 6 },
      { label: 'Download uploaded file label', value: 'downloadFileLabel', required: true, language: true, md: 6 },
      { label: 'Accept', value: 'accept', md: 6 }
    ],
    default: {
      variant: VariantTypes.CONTAINED,
      label: 'File upload',
      uploadLabel: 'Upload',
      cancelLabel: 'Cancel',
      confirmRecordingLabel: 'Confirm',
      stopRecordingLabel: 'Stop recording',
      recordVideoMenuLabel: 'Record video',
      uploadFileMenuLabel: 'Upload file',
      downloadFileLabel: 'File',
      ...defaultPlacement,
      fullWidth: false,
      alignment: 'flex-start'
    }
  },
  [FormFields.SPACING]: {
    fields: [
      { label: 'Width', value: 'md', type: 'autocomplete', items: columns, suffix: '%', itemText: 'text', itemValue: 'value', required: true },
      { label: 'Height', value: 'height', type: 'number' }
      // { label: 'Background', value: 'backgroundColor', type: 'color', md: 6, if: ({ item }) => item.md === 10 }
    ],
    default: {
      ...defaultPlacement,
      fullWidth: true,
      xs: 0,
      height: 0
    }
  }
})
