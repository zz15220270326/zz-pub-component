import {
  createApp,
  watch,
} from 'vue';
// import type {} from 'vue';
import type { MessageMethodOptions, MessageInstance } from '../types';
import {
  getMessageOptions,
  renderMessageApp,
  showMessageByVm,
  destroyMessage,
  fillMessageApi,
} from '../modules/utils';
import Message from './Message';
import {
  addItemToQueue,
  removeItemFromQueue,
  removeQueueFirstItem,
  getQueueLen,
  getQueueItemByMessage,
} from '../modules/queue';

const message = (opt: MessageMethodOptions): MessageInstance => {
  const {
    message,
    duration,
    closable,
    type,
    position,
    onClose,
    isLimit,
    limitCount,
    center,
    dangerouslyUseHTMLString,
    grouping,
  } = getMessageOptions(opt);

  const offset: number = getQueueLen();

  if (isLimit && offset === limitCount - 1) {
    removeQueueFirstItem();
  }

  if (grouping) {
    if (!!getQueueItemByMessage(message)) {
      getQueueItemByMessage(message)?.vm.setGroupingCount(count => count + 1);
    
      return {
        close,
      };
    }
  }

  // 1. 创建 app
  const app = createApp(Message, {
    modelValue: false,
    message,
    duration,
    closable,
    type,
    offset,
    position,
    center,
    dangerouslyUseHTMLString,
    grouping,
  });
  const vm = renderMessageApp(app);

  // 2. 挂载 vm
  showMessageByVm(vm);
  addItemToQueue({ vm, app, count: 1 });

  // 3. 观察 vm.messageShow
  watch(() => vm.messageShow, (newVal, oldVal) => {
    /* console.log(
      'messageShow 的值发生了变化：\n  newVal: 【%s】 \n  oldVal: 【%s】',
      newVal,
      oldVal,
    ); */

    !newVal && close();
  });

  return {
    close,
  };

  function close() {
    if (app && vm) {
      destroyMessage(app, duration);
      removeItemFromQueue({ vm, app, count: 1 });
    }
    onClose?.();
  }
}

export default fillMessageApi(message);
