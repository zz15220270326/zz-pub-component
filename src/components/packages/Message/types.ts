import type {
  ComputedRef,
  ExtractPropTypes,
  VNode,
  ComponentPublicInstance,
  App,
} from 'vue';
import { messageProps } from './modules/config';

export type MessageType = (
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
);

export type MessagePosition = (
  | 'top'
  | 'bottom'
);

export interface BasicMessageMethodOptions {
  /** 消息的类型 （可选值："`info`" / "`success`" / "`error`" / "`warning`"） */
  type: MessageType;
  /** 在没有鼠标操作下，消息的停留时长（单位：`ms`） */
  duration: number;
  /** 消息是否可以直接被关闭？(默认为 `false`) */
  closable: boolean;
  /** 消息的主体内容 */
  message: string | VNode;
  /** 消息出现的位置，默认为 `top`。（可选值：`top` / `bottom` */
  position: MessagePosition;
  /** 消息关闭时的回调函数 */
  onClose: () => void;
  /** 消息的展示个数是否需要被限制 (默认值：`false`) */
  isLimit: boolean;
  /** 消息限制展示的个数 (仅在 `isLimit` 为 `true` 时生效) */
  limitCount: number;
  /** 消息内容是否居中？ */
  center: boolean;
  /** 是否将 message 当作 HTML 进行处理 */
  dangerouslyUseHTMLString: boolean;
  /** 是否对 message 进行分组处理 （默认：`false`, 不要和 `closeable` 一起使用） */
  grouping: boolean;
}

export type MessageMethodOptions = (
  | string
  | Partial<BasicMessageMethodOptions>
);

export interface MessageInstance {
  close: () => void;
}

export interface MessageMethod {
  (options: MessageMethodOptions): MessageInstance;
  install: (app: App) => void;
  closeAll: () => void;
  info: (message: string, duration?: number) => MessageInstance;
  success: (message: string, duration?: number) => MessageInstance;
  warning: (message: string, duration?: number) => MessageInstance;
  error: (message: string, duration?: number) => MessageInstance;
}

export type MessageComponentProps = ExtractPropTypes<typeof messageProps>;

export interface MessageComponentExpose {
  id: string;
  message: string | VNode;
  messageShow: ComputedRef<boolean>;
  setMessageShow(setMessageShow: boolean): void;
  setOffset: (newOffset: number | ((oldOffset: number) => number)) => void;
  setGroupingCount: (setter: number | ((oldGroupingCount: number) => number)) => void;
}

export interface MessageEventOptions {
  props: MessageComponentProps;
  setMessageShow(setMessageShow: boolean): void;
}

export interface MessageTimerOptions {
  props: MessageComponentProps;
  closeMessage(): void;
}

export type VmType = (
  & ComponentPublicInstance
  & MessageComponentExpose
);

export interface MessageQueueItem {
  vm: VmType;
  app: App;
  count: number;
}

export interface MessageQueueState {
  queue: MessageQueueItem[];
}
