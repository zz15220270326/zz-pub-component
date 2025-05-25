<script setup lang="ts">
  import { ref } from 'vue';

  import { Card } from '@/components/packages/Card';
  import { Transfer as MyTransfer } from '@/components/packages/Transfer';
  import { TransferItem } from '@/components/packages/Transfer';

  defineOptions({ name: 'TransferDemo' });

  const data: TransferItem[] = Array.from({ length: 100 }).map((_, i) => ({
    key: `${i + 1}`,
    label: `content-${i + 1}`,
    disabled: i % 5 === 0,
  }));

  const selectedKeys = ref(
    Array.from({ length: data.length }, (_, i) => i)
      .filter(item => (item + 1) % 10 === 0)
      .map(item => String(item))
  );

</script>

<template>
  <Card header="Transfer Demo" style="width: 80%; margin: 20px auto;">
    <my-transfer
      v-model="selectedKeys"
      :titles="['我想选', '我选了']"
      :data="data"
      allow-search
      allow-clear
    ></my-transfer>
  </Card>
</template>
