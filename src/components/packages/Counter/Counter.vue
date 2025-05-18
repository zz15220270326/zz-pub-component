<script lang="ts" setup>
  import { ref } from 'vue';
import { CounterProps } from './types';

  const props = withDefaults(defineProps<Partial<CounterProps>>(), {
    count: 0,
  });

  const count = ref(props.count);

  function addCount() {
    count.value += 1;
  }
</script>

<template>
  <div>
    <h1>Counter</h1>

    <button @click="addCount">You click me {{ count }} times</button>
  </div>
</template>