<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import * as constant from '../modules/constant';
  import CheckboxLabel from './Sub/CheckboxLabel.vue';

  const props = defineProps(constant.props);

  const emit = defineEmits(constant.emits);

  const checkedValue = ref(false);

  watch(checkedValue, (newValue) => {
    emit('update:modelValue', newValue);
  });

  onMounted(() => {
    checkedValue.value = !!props.modelValue;
  });

  function handleCheckboxChange(e: Event) {
    const el = e.target || e.srcElement;

    if (el instanceof HTMLSpanElement) {
      checkedValue.value = !checkedValue.value;
      return;
    }

    if (!(el instanceof HTMLInputElement)) return;

    checkedValue.value = el.checked;
  }
</script>

<template>
  <span class="my-checkbox" @click="handleCheckboxChange">
    <checkbox-label
      v-if="props.labelPosition === 'left'"
      :label="props.label"
      :checked="checkedValue"
    />
    <input
      class="my-checkbox__input"
      type="checkbox"
      :checked="checkedValue"
      :disabled="props.disabled"
      :indeterminate="props.indeterminate"
      @change="handleCheckboxChange"
    />
    <span
      :class="[
        'my-checkbox__icon',
        checkedValue ? 'my-checkbox__icon-checked' : ''
      ]"
    />
    <checkbox-label
      v-if="props.labelPosition === 'right'"
      :label="props.label"
      :checked="checkedValue"
    />
  </span>
</template>