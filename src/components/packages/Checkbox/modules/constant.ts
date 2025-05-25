import { PropType } from "vue";

export const props = {
  label: {
    type: String,
    default: '',
  },
  value: {
    type: [String, Number, Boolean],
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md',
  },
  color: {
    type: String,
    default: 'primary',
  },
  labelPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  }
};

export const emits = {
  'update:modelValue': (value: string | number | boolean) =>
    ['string', 'number', 'boolean'].includes(typeof value),
  'change': (value: boolean) =>
    ['boolean'].includes(typeof value),
};
