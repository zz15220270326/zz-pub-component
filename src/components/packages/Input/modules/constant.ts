import type { PropType } from 'vue';
import type { InputType } from './types';

export const name = 'MyInput';

export const props = {
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<InputType>,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: undefined,
  },
  minLength: {
    type: Number,
    default: undefined
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
  },
  autoFocus: {
    type: Boolean,
    default: false
  },
  allowClear: {
    type: Boolean,
    default: false
  }
} as const;

export const emits = {
  // 'update:modelValue': (value: string) => typeof value === 'string',
  'update:model-value': (value: string) => typeof value === 'string',
  'input': (value: string) => typeof value === 'string',
  'clear': () => true,
  'blur': (event: FocusEvent) => typeof event === 'object' && event !== null,
  'focus': (event: FocusEvent) => typeof event === 'object' && event !== null,
  'change': (value: string) => typeof value === 'string',
  'keydown': (event: KeyboardEvent) => typeof event === 'object' && event !== null,
} as const;
