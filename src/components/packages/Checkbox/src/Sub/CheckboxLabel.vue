<script setup lang="ts">
  defineOptions({
    name: 'MyCheckboxLabel',
  });

  const props = defineProps<{ label: string, checked: boolean }>();
</script>

<template>
  <span :class="['my-checkbox__label', props.checked ? 'my-checkbox__label-checked' : '']">
    <slot name="default">
      <span>{{ props.label }}</span>
    </slot>
  </span>
</template>