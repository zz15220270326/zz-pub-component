<script lang="ts" setup>
  import { ref } from 'vue';
  import Card from '@/components/packages/Card';
  import Checkbox from '@/components/packages/Checkbox/src/Checkbox.vue';

  const checkboxValue = ref<boolean>(false);
</script>

<template>
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
