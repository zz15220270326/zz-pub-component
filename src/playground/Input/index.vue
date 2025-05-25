<script setup lang="ts">
  import { ref } from 'vue';
  import { Card } from '@/components/packages/Card';
  import MyInput from '@/components/packages/Input/src/Input.vue';

  const inputValue = ref<string>('');
</script>

<template>
  <Card header="Input Demo" style="width: 80%; margin: 20px auto;">
    <my-input
      v-model="inputValue"
      placeholder="please input ..."
      allow-clear
    />
  </Card>
</template>