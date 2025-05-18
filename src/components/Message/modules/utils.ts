import type { App } from 'vue';
import type {
  MessageMethod,
  MessageInstance,
  MessageMethodOptions,
  BasicMessageMethodOptions,
  VmType,
} from '../types';
import { defaultMessageOptions, messageTypeList } from './config';
import { clearQueue } from './queue';

export function getMessageOptions(origin: MessageMethodOptions): BasicMessageMethodOptions {
  if (typeof origin === 'string') {
    return {
      ...defaultMessageOptions,
      message: origin,
    };
  }

  return {
    ...defaultMessageOptions,
    ...origin,
  };
}

export function renderMessageApp(app: App): VmType {
  const oFrag: DocumentFragment = document.createDocumentFragment();
  document.body.appendChild(oFrag);
  return app.mount(oFrag) as VmType;
}

export function showMessageByVm(vm: VmType) {
  vm.setMessageShow(true);
}

export function destroyMessage(app: App, duration: number) {
  setTimeout(() => {
    app.unmount();
  }, 300);
}

export function fillMessageApi(
  originMessage: (options: MessageMethodOptions) => MessageInstance,
): MessageMethod {
  const message: MessageMethod = <MessageMethod> originMessage;
  
  message.install = (app) => {
    app.config.globalProperties.$message = message;
  }

  message.closeAll = () => {
    clearQueue();
  }

  messageTypeList.forEach(type => {
    message[type] = (opt, duration = 1500) => {
      const options = getMessageOptions(opt);
    
      return message({
        ...options,
        duration,
        type,
      });
    }
  });

  return message;
}
