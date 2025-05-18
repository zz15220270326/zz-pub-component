import type { PropType, VNode, RendererElement } from 'vue';
import type {
  MessageType,
  BasicMessageMethodOptions,
  MessagePosition,
} from '../types';

export const messageProps = {
  modelValue: {
    type: Boolean,
    required: false,
    default: false,
  },
  message: {
    type: [
      String,
      Object,
    ] as PropType<string | VNode>,
    default: 'Message',
    required: true,
  },
  duration: {
    type: Number,
    default: 1500,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as PropType<MessageType>,
    default: 'info',
  },
  offset: {
    type: Number,
    default: 0,
  },
  appendTo: {
    type: [String, Object] as PropType<string | RendererElement>,
    default: 'body',
  },
  position: {
    type: String as PropType<MessagePosition>,
    default: 'top',
  },
  center: {
    type: Boolean,
    default: false,
  },
  dangerouslyUseHTMLString: {
    type: Boolean,
    default: false,
  },
  grouping: {
    type: Boolean,
    default: false,
  },
};

export const messageEmits = {
  'update:modelValue': (val: boolean) => true,
  close: (val: boolean) => true,
}

export const defaultMessageOptions: BasicMessageMethodOptions = {
  message: 'Message',
  duration: 1500,
  closable: false,
  type: 'info',
  position: 'top',
  onClose: () => null,
  isLimit: false,
  limitCount: 5,
  center: false,
  dangerouslyUseHTMLString: false,
  grouping: false,
};

export const messageTypeList: MessageType[] = [
  'info',
  'success',
  'warning',
  'error',
];
