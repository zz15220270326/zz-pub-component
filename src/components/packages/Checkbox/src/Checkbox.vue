<script setup lang="ts">
  import { watchEffect, ref, watch } from 'vue';
  import * as constant from '../modules/constant';
  import CheckboxLabel from './Sub/CheckboxLabel.vue';

  const props = defineProps(constant.props);

  const emit = defineEmits(constant.emits);

  const checkedValue = ref(false);

  watch(checkedValue, (newValue) => {
    emit('update:modelValue', newValue);
  });

  watchEffect(() => {
    checkedValue.value = !!props.modelValue;
  });

  function handleCheckboxChange(e: Event) {
    if (props.disabled) {
      return;
    }

    const el = e.target || e.srcElement;

    if (el instanceof HTMLSpanElement) {
      checkedValue.value = !checkedValue.value;
      emit('change', checkedValue.value);
      return;
    }

    if (!(el instanceof HTMLInputElement)) return;

    checkedValue.value = el.checked;
    emit('change', el.checked);
  }
</script>

<template>
  <span class="my-checkbox" @click="handleCheckboxChange">
    <checkbox-label
      v-if="props.labelPosition === 'left'"
      :label="props.label"
      :disabled="props.disabled"
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
        checkedValue ? 'my-checkbox__icon-checked' : '',
        !checkedValue && props.indeterminate
          ? 'my-checkbox__icon-indeterminate'
          : '',
      ]"
    />
    <checkbox-label
      v-if="props.labelPosition === 'right'"
      :label="props.label"
      :disabled="props.disabled"
      :checked="checkedValue"
    />
  </span>
</template>