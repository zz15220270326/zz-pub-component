import { reactive, computed, VNode } from 'vue';
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

function getQueueItemByMessage(message: string | VNode): MessageQueueItem | undefined {
  return queueState.queue.find(item => item.vm.message === message);
}

function addItemToQueue(queueItem: MessageQueueItem) {
  if (queueState.queue.includes(queueItem)) {
    return;
  }

  queueState.queue.push(queueItem);
}

function removeItemFromQueue(queueItem: Omit<MessageQueueItem, 'app' & 'count'>) {
  const index = getQueueItemIndex(queueItem);
  if (index === -1) {
    return;
  }

  const oldQueue: MessageQueueItem[] = [...queueState.queue];

  queueState.queue.splice(index, 1);

  updateQueueItemIndex(queueItem.vm, oldQueue);
}

function removeQueueFirstItem() {
  const removeQueueItem = queueState.queue.pop();

  if (!removeQueueItem) return;

  removeQueueItem.vm.setMessageShow(false);
  let t: null | ReturnType<typeof setTimeout> = setTimeout(() => {
    removeQueueItem.app.unmount();

    if (t) {
      clearTimeout(t);
      t = null;
    }
  }, 300);
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
  removeQueueFirstItem,
  getQueueItemIndex,
  clearQueue,
  getQueueLen,
  getQueueItemByMessage,
};
