<script lang="ts" setup>
  import {
    CardDemos,
    MessageDemo,
    InputDemo,
    CheckboxDemo,
    TransferDemo,
  } from '@/playground/index';

  const { Demo1, Demo2, Demo3, Demo4 } = CardDemos;

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

  <message-demo />

  <input-demo />

  <checkbox-demo />

  <transfer-demo />
</template>