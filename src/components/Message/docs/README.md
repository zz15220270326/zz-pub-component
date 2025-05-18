> 实现一个 Message 组件

# 前言

`<Message>` 组件是一个用于展示消息的组件，通常用于在应用程序中传递和显示消息。该组件应该具有可自定义的样式和布局，并能够支持多种类型的消息，如成功、警告、错误等。

本文介绍如何实现一个 Message 组件，涉及到的技术：
- `Vue3.0`
- `JSX`
- `TypeScript`


# 首先，我们需要什么？

## 需要一个 `message` 函数!

```ts
import { message } from '@/components';
```

## 调用 `message` 函数
我们可以调用 `message` 这个方法来创建提示信息。
- 直接调用

```ts
message({
  type: 'info',
  message: 'this is a message',
  duration: 1500,
});
```

```ts
message('this is a message');
```

- 调用静态方法调用

```ts
message.success('Success Message', 3000);
```

## 关闭 `message`

### 关闭单个 `message` 实例

```ts
const messageInstance = message({
  type: 'info',
  message: 'this is a message',
  duration: 1500,
});

// 直接关闭
messageInstance.close();
```

### 全量关闭 `message`
调用 `message.closeAll()` 关闭所有的 Message 组件

```ts
message.closeAll();
```

# 参数？配置？

1. `message` 方法

| 参数名称 | 参数类型 | 参数说明 | 是否必传？ |
|    -    |     -    |    -    |     -      |
| `type` | 字符串 | 展示 `Message` 的类型 | 否 |
| `duration` | 数字 | 在没有鼠标操作下，`Message` 的停留时长（单位：毫秒） | 否 |
| `closable` | 布尔 | `Message` 是否可以直接关闭？ | 否 |
| `message` | 字符串或虚拟节点 | `Message` 的内容 | 是（不传递默认显示组件内部配置的内容） |
| `position` | 字符串 | `Message` 出现的位置，默认为 `top`。（可选值：`top` / `bottom`） | 否 |
| `onClose` | 函数 | `Message` 关闭时的回调函数 | 否 |

# 程序设计
## 1. 组织组件架构
```sh
|- Message
  |- docs     # 组件文档
    |- README.md    # 组件使用说明 (相当于组件的摘要)
    |- CHANGELOG.md # 组件更新日志 (用于项目迭代)
  |- modules  # 组件用到的模块
    |- config.ts  # 组件的静态配置
    |- hooks.ts   # 组件用到的 hooks
    |- queue.ts   # 组件的队列模块
    |- utils.ts   # 组件用到的工具函数
  |- src      # 组件核心源码
    |- Message.tsx # 组件视图
    |- method.ts # message 方法
  |- index.ts # 组件出口
  |- types.ts # 组件类型声明
```

## 2. 设计出口, 静态配置和类型

- 出口 `index.ts`
```ts
export { default as message } from './src/method';
export type * from './types';
```

```ts
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
  type: MessageType;
  duration: number;
  closable: boolean;
  message: string | VNode;
  position: MessagePosition;
  onClose: () => void;
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
  closeAll: () => void;
  info: (message: string, duration?: number) => MessageInstance;
  success: (message: string, duration?: number) => MessageInstance;
  warning: (message: string, duration?: number) => MessageInstance;
  error: (message: string, duration?: number) => MessageInstance;
}

export type MessageComponentProps = ExtractPropTypes<typeof messageProps>;

export interface MessageComponentExpose {
  id: string;
  messageShow: ComputedRef<boolean>;
  setMessageShow(setMessageShow: boolean): void;
  setOffset: (newOffset: number | ((oldOffset: number) => number)) => void;
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
}

export interface MessageQueueState {
  queue: MessageQueueItem[];
}
```

- 静态配置 `modules/config.ts`
```ts
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
};

export const messageTypeList: MessageType[] = [
  'info',
  'success',
  'warning',
  'error',
];
```

## 3. 渲染组件视图

`src/Message.tsx`
```tsx
import { Teleport, Transition, defineComponent } from 'vue';

export default defineComponent({
  name: 'MyMessage',
  setup(props, ctx) {

    return (
      <Teleport to={props.appendTo}>
        <Transition name={`my-message-${props.position}`}>
          <div
            v-show={messageShow.value}
            class={messageWrapCls.value}
            style={messageWrapStyle.value}
            onMouseenter={handleMouseEnterMessage}
            onMouseleave={handleMouseLeaveMessage}
          >
            <i class={messageIconCls.value} />
            <p class={messageContentCls.value}>
              {messageContent.value} {/* {props.offset} */}
            </p>
            {props.closable === true && (
              <i
                class={messageCloseIconCls.value}
                onClick={handleCloseMessage}
              />
            )}
          </div>
        </Transition>
      </Teleport>
    );
  }
});
```

## 3. 基于函数式编程进行逻辑模块拆分，完善组件细节
### hook 设计
```sh
  |- useId            # 生成一个随机的 id (基于 Base64 编码)
  |- useMessageCls    # 整合 Message 组件用到的 class
  |- useMessageStyle  # 整合 Message 组件用到的 style
  |- useMessageShow   # 整合 Message 组件的显示逻辑
  |- useMessageExpose # 整合 Message 对外抛出的 Api (在 method 中使用)
  |- useMessageEvent  # 整合 Message 组件的事件处理逻辑
  |- useMessageOffset # 整合 Message 组件的偏移逻辑 (基于队列)
```

### hook 引用
```tsx
import {
  defineComponent,
  computed,
  Transition,
  Teleport,
} from 'vue';
import type { ComputedRef, VNode } from 'vue';
import { messageProps, messageEmits } from '../modules/config';
import {
  useId,
  useMessageCls,
  useMessageShow,
  useMessageStyle,
  useMessageExpose,
  useMessageEvent,
  useMessageOffset,
} from '../modules/hooks';

export default defineComponent({
  name: 'MyMessage',
  props: messageProps,
  emits: messageEmits,
  setup(props, { expose, emit }) {
    const id = useId();

    const {
      messageWrapCls,
      messageIconCls,
      messageContentCls,
      messageCloseIconCls,
    } = useMessageCls(props);
    const [messageShow, setMessageShow] = useMessageShow(props, emit);
    const { offsetState, setOffset } = useMessageOffset(props);
    useMessageExpose({
      id,
      messageShow,
      setMessageShow,
      setOffset,
    }, expose);
    const { messageWrapStyle } = useMessageStyle(offsetState, props);
    const {
      handleCloseMessage,
      handleMouseEnterMessage,
      handleMouseLeaveMessage,
    } = useMessageEvent({ props, setMessageShow });

    const messageContent: ComputedRef<string | VNode> = computed(() => {
      return props.message;
    });

    return () => (
      <Teleport to={props.appendTo}>
        <Transition name={`my-message-${props.position}`}>
          <div
            v-show={messageShow.value}
            class={messageWrapCls.value}
            style={messageWrapStyle.value}
            onMouseenter={handleMouseEnterMessage}
            onMouseleave={handleMouseLeaveMessage}
          >
            <i class={messageIconCls.value} />
            <p class={messageContentCls.value}>
              {messageContent.value} {/* {props.offset} */}
            </p>
            {props.closable === true && (
              <i
                class={messageCloseIconCls.value}
                onClick={handleCloseMessage}
              />
            )}
          </div>
        </Transition>
      </Teleport>
    );
  },
});
```

### hook 实现
```ts
import {
  computed,
  reactive,
  watch,
  shallowRef,
  onMounted,
} from 'vue';
import type {
  ComputedRef,
  CSSProperties,
  // VNode,
} from 'vue';
import type {
  MessageComponentExpose,
  MessageComponentProps,
  MessageEventOptions,
  MessageTimerOptions,
} from '../types';

export function useMessageCls(props: MessageComponentProps) {
  const messageWrapCls: ComputedRef<string[]> = computed(() => {
    return [
      'my-message',
      `my-message-${props.type}`,
    ];
  });

  const messageIconCls: ComputedRef<string[]> = computed(() => {
    return [
      'my-message-icon',
      'my-message-type-icon',
      `my-message-icon-${props.type}`,
      'iconfont',
      `icon-${props.type}`
    ];
  });

  const messageContentCls: ComputedRef<string[]> = computed(() => {
    return [
      'my-message-content',
      `my-message-content-${props.type}`,
    ];
  });

  const messageCloseIconCls: ComputedRef<string[]> = computed(() => {
    return [
      'my-message-icon',
      'my-message-close-icon',
      `my-message-close-icon-${props.type}`,
      'iconfont',
      'icon-close',
    ];
  })

  return {
    messageWrapCls,
    messageIconCls,
    messageContentCls,
    messageCloseIconCls,
  };
}

export function useMessageStyle(
  state: Pick<MessageComponentProps, 'offset'>,
  props: MessageComponentProps,
) {
  const messageWrapStyle: ComputedRef<CSSProperties> = computed(() => {
    const marginNum = Math.ceil(Number(state.offset)) + 1;
    const messageNum = Math.ceil(state.offset);
    
    return {
      zIndex: 1000,
      [props.position]: (marginNum * 15 + messageNum * 40) + 'px',
    };
  });

  return {
    messageWrapStyle,
  };
}

export function useMessageShow(
  props: MessageComponentProps,
  emit: ((event: "update:modelValue", val: boolean) => void) & ((event: "close", val: boolean) => void),
): [ComputedRef<boolean>, (newIsShow: boolean) => void] {
  const state = reactive({
    show: props.modelValue,
  });

  const isShow: ComputedRef<boolean> = computed(() => state.show);

  function setIsShow(newIsShow: boolean) {
    state.show = newIsShow;
    emit('update:modelValue', newIsShow);
  }

  watch(() => props.modelValue, (newValue) => {
    setIsShow(newValue);
  });

  return [isShow, setIsShow];
}

export function useMessageExpose(
  exposedApi: MessageComponentExpose,
  expose: (exposed: MessageComponentExpose) => void,
) {
  expose(exposedApi);

  return exposedApi;
}

export function useMessageEvent({
  props,
  setMessageShow,
}: MessageEventOptions) {
  const {
    handleMouseEnterMessage,
    handleMouseLeaveMessage,
  } = useMessageTimerControl({
    props,
    closeMessage,
  });

  return {
    handleCloseMessage: closeMessage,
    handleMouseEnterMessage,
    handleMouseLeaveMessage,
  };

  function closeMessage() {
    setMessageShow(false);
  }
}

export function useMessageTimerControl(options: MessageTimerOptions) {
  const { props, closeMessage } = options;
  const timerRef = shallowRef<ReturnType<typeof setTimeout> | null>(null);
  
  const handleMouseEnterMessage = () => {
    endTimer();
  }

  const handleMouseLeaveMessage = () => {
    Promise.resolve()
      .then(startTimer);
  }

  onMounted(() => {
    startTimer();
  });

  return {
    handleMouseEnterMessage,
    handleMouseLeaveMessage,
  };

  function startTimer() {
    timerRef.value = setTimeout(() => {
      closeMessage();
      endTimer();
    }, props.duration);
  }

  function endTimer() {
    if (!timerRef.value) return;
    clearTimeout(timerRef.value);
    timerRef.value = null;
  }
}

export function useMessageOffset(props: MessageComponentProps) {
  const offsetState = reactive({
    offset: props.offset,
  });

  const setOffset = (
    newOffset: number | ((oldOffset: number) => number)
  ) => {
    if (typeof newOffset === 'function') {
      offsetState.offset = newOffset(offsetState.offset);
    } else {
      offsetState.offset = newOffset;
    }
  }

  return {
    offsetState,
    setOffset,
  }
}

export function useId(): string {
  return btoa(Date.now().toString());
}
```

## 4. 设计 Message 队列模块

`modules/queue.ts`
```ts
import { reactive, computed } from 'vue';
import {
  MessageQueueItem,
  MessageQueueState,
  VmType,
} from '../types';

const queueState: MessageQueueState = reactive({
  queue: [],
});

function getQueue() {
  return computed(() => queueState.queue);
}

function addItemToQueue(queueItem: MessageQueueItem) {
  if (queueState.queue.includes(queueItem)) {
    return;
  }

  queueState.queue.push(queueItem);
}

function removeItemFromQueue(queueItem: MessageQueueItem) {
  const index = getQueueItemIndex(queueItem);
  if (index === -1) {
    return;
  }

  const oldQueue: MessageQueueItem[] = [...queueState.queue];

  queueState.queue.splice(index, 1);

  updateQueueItemIndex(queueItem.vm, oldQueue);
}

function getQueueItemIndex(queueItem: MessageQueueItem) {
  return queueState.queue.findIndex(item => item.vm === queueItem.vm);
}

function clearQueue() {
  queueState.queue.forEach((item) => {
    item.vm.setMessageShow(false);
    setTimeout(() => {
      item.app.unmount();
    }, 300);
  });

  queueState.queue = [];
}

function getQueueLen() {
  return getQueue().value.length;
}

function updateQueueItemIndex(vm: VmType, queue: MessageQueueItem[]) {
  const { id } = vm;
  const targetIdx = queue.findIndex(item => item.vm.id === id);

  if (targetIdx === -1) return;

  queue
    .slice(targetIdx)
    .forEach(item => {
      item.vm.setOffset(offset => {
        return offset === 0 ? 0 : offset - 1;
      });
    });
}

export {
  addItemToQueue,
  removeItemFromQueue,
  getQueueItemIndex,
  clearQueue,
  getQueueLen,
};
```

## 5. 整合 method 模块，大功告成

### 核心逻辑实现
`src/method.ts`
```ts
import {
  createApp,
  watch,
} from 'vue';
// import type {} from 'vue';
import type { MessageMethod } from '../types';
import {
  getMessageOptions,
  renderMessageApp,
  showMessageByVm,
  destroyMessage,
} from '../modules/utils';
import Message from './Message';
import {
  addItemToQueue,
  removeItemFromQueue,
  getQueueLen,
  clearQueue,
} from '../modules/queue';

const message: MessageMethod = (opt) => {
  const {
    message,
    duration,
    closable,
    type,
    position,
    onClose,
  } = getMessageOptions(opt);

  const app = createApp(Message, {
    modelValue: false,
    message,
    duration,
    closable,
    type,
    offset: getQueueLen(),
    position,
  });
  const vm = renderMessageApp(app);

  // 1. 挂载 vm
  showMessageByVm(vm);
  addItemToQueue({ vm, app });

  // 2. 观察 vm.messageShow
  watch(() => vm.messageShow, (newVal, oldVal) => {
    console.log('messageShow 的值发生了变化：\n  newVal: 【%s】 \n  oldVal: 【%s】', newVal, oldVal);

    !newVal && close();
  });

  return {
    close,
  };

  function close() {
    destroyMessage(app, duration);
    removeItemFromQueue({ vm, app });
    onClose?.();
  }
}
```

### 追加逻辑实现
```ts
message.closeAll = () => {
  clearQueue();
}
message.info = (opt, duration = 1500) => {
  const options = getMessageOptions(opt);

  return message({
    ...options,
    duration,
    type: 'info',
  });
}
message.success = (opt, duration = 1500) => {
  const options = getMessageOptions(opt);

  return message({
    ...options,
    duration,
    type: 'success',
  });
}
message.warning = (opt, duration = 1500) => {
  const options = getMessageOptions(opt);

  return message({
    ...options,
    duration,
    type: 'warning',
  });
}
message.error = (opt, duration = 1500) => {
  const options = getMessageOptions(opt);

  return message({
    ...options,
    duration,
    type: 'error',
  });
}
```

### 模块导出
```ts
export default message;
```

## 组件示例

## 完整代码

