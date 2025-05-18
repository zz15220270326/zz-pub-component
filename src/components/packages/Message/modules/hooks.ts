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
  });

  const messageGroupingCountCls: ComputedRef<string[]> = computed(() => {
    return [
      'my-message-grouping-count',
      `my-message-grouping-count-${props.type}`,
    ];
  });

  return {
    messageWrapCls,
    messageIconCls,
    messageContentCls,
    messageCloseIconCls,
    messageGroupingCountCls,
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
      zIndex: 1000 + props.offset,
      [props.position]: (marginNum * 15 + messageNum * 40) + 'px',
      textAlign: props.center ? 'center' : undefined,
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

export function useMessageGrouping() {
  const state = reactive({
    groupingCount: 1,
  });

  const groupingCount = computed(() => state.groupingCount);

  const setGroupingCount = (
    setter: number | ((oldGroupingCount: number) => number)
  ) => {
    if (typeof setter === 'function') {
      state.groupingCount = setter(state.groupingCount);
    } else {
      state.groupingCount = setter;
    }
  }

  return {
    groupingCount,
    setGroupingCount,
  };
}
