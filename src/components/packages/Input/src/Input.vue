<script setup lang="ts">
  import { computed, onMounted, shallowRef } from 'vue';
  import * as constant from '../modules/constant';

  const inputRef = shallowRef<HTMLInputElement | null>(null);

  defineOptions({ name: constant.name });

  const props = defineProps(constant.props);

  const emit = defineEmits(constant.emits);

  const inputValue = computed({
    get() {
      return inputRef.value?.value || '';
    },
    set(value) {
      if (inputRef.value) {
        inputRef.value.value = value;
      }

      emit('update:model-value', value);
    },
  });

  onMounted(() => {
    const oInput = inputRef.value;
    if (!oInput) return;

    if (props.modelValue) {
      oInput.value = props.modelValue;
    }
  });

  function handleInput(e: Event) {
    const el = e.target;

    if (!(el instanceof HTMLInputElement)) return;

    inputValue.value = el.value;
    emit('input', el.value);
  }

  function handleChange(e: Event) {
    const el = e.target;

    if (!(el instanceof HTMLInputElement)) return;
    
    inputValue.value = el.value;
    emit('change', el.value);
  }

  function handleFocus(e: FocusEvent) {
    const el = e.target;

    if (!(el instanceof HTMLInputElement)) return;
    emit('focus', e);
  }

  function handleBlur(e: FocusEvent) {
    const el = e.target;

    if (!(el instanceof HTMLInputElement)) return;
    emit('blur', e);
  }

  function handleClear(e: Event) {
    e.stopPropagation();

    inputValue.value = '';
    inputRef.value?.focus();
  }

  function handleKeydown(e: KeyboardEvent) {
    emit('keydown', e);
  }
</script>

<template>
  <span class="my-input">
    <!-- :id="Date.now()" -->
    <input
      ref="inputRef"
      class="my-input-inner"
      v-bind="$attrs"
      :minlength="minLength"
      :maxlength="maxLength"
      :disabled="disabled"
      :readonly="readOnly"
      :placeholder="placeholder"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />
    <svg
      v-if="props.allowClear"
      v-show="props.modelValue.length > 0"
      class="input-icon input-icon-close"
      width="24"
      height="24" 
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      @click="handleClear"
    >
      <line x1="5" y1="5" x2="19" y2="19" stroke="black" stroke-width="2" />
      <line x1="5" y1="19" x2="19" y2="5" stroke="black" stroke-width="2" />
    </svg>
  </span>
</template>