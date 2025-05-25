<script setup lang="ts">
  defineOptions({
    name: 'MyCheckboxLabel',
  });

  const props = defineProps<{ label: string, checked: boolean, disabled: boolean }>();
</script>

<template>
  <span
    :class="[
      'my-checkbox__label',
      props.checked ? 'my-checkbox__label-checked' : '',
      props.disabled ? 'my-checkbox__label-disabled' : ''
    ]"
  >
    <slot name="default">
      <span>{{ props.label }}</span>
    </slot>
  </span>
</template>