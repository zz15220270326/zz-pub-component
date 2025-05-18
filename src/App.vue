<script lang="ts" setup>
  import { ref } from 'vue';

  import { Input as MyInput, Card, Checkbox } from '@/components';
  import CardDemos from '@/components/Card/playdround';

  import { message, type MessageType } from './components/Message';

  const { Demo1, Demo2, Demo3, Demo4 } = CardDemos;

  const inputValue = ref<string>('');
  const checkboxValue = ref<boolean>(false);

  const handleOpenMessage = (type: MessageType = 'info') => {
    // message({
    //   type: 'error',
    //   // message: 'this is a message',
    //   message: h('div', { style: { color: 'purple' } }, '自定义 VNode'),
    //   duration: 3000,
    //   closable: true,
    //   // position: 'bottom',
    // });
    message({
      type,
      // message: `
      //   <a href="https://www.baidu.com" target="_blank">This is a ${type} message long long long long long</a>
      // `,
      message: `This is a ${type} message long long long long long`,
      duration: 3 * 1000,
      // position: 'bottom',
      // isLimit: true,
      // limitCount: 10,
      onClose: () => {
        message[type](`message ${type} done`);
      },
      // center: true,
      // dangerouslyUseHTMLString: true,
      // grouping: true,
    });
  }

  const handleClearMessage = () => {
    message.closeAll();
  }

</script>

<template>
  <div v-if="false">
    <div class="space">
      <demo1 />
      <hr />
    </div>
    <div class="space">
      <demo2 />
      <hr />
    </div>
    <div class="space">
      <demo3 />
      <hr />
    </div>
    <div class="space">
      <demo4 />
      <hr />
    </div>
  </div>

  <Card header="Message Demo" style="width: 80%; margin: 20px auto;">
    <button class="btn" style="margin-right: 10px;" @click="() => handleOpenMessage()">普通提示</button>
    <button class="btn" style="margin-right: 10px;" @click="() => handleOpenMessage('success')">成功提示</button>
    <button class="btn" style="margin-right: 10px;" @click="() => handleOpenMessage('error')">错误提示</button>
    <button class="btn" style="margin-right: 10px;" @click="() => handleOpenMessage('warning')">告警提示</button>
    <button class="btn" style="margin-right: 10px;" @click="handleClearMessage">关闭所有的 message</button>
  </Card>
  
  <Card header="Input Demo" style="width: 80%; margin: 20px auto;">
    <my-input
      v-model="inputValue"
      placeholder="please input ..."
      allow-clear
    />
  </Card>
  <Card
    header="Checkbox Demo"
    style="width: 80%; margin: 20px auto;"
  >
    <Checkbox
      v-model="checkboxValue"
      :label="checkboxValue ? '选中' : '未选中'"
    />
  </Card>
</template>