<script setup lang="ts">
  import { TransferDirectionType } from '../../types';
  import { RightArrowIcon, LeftArrowIcon } from '../../../Icon';

  interface TransferCtrlProps {
    disabled: boolean;
    leftButtonDisabled: boolean;
    rightButtonDisabled: boolean;
  }

  const ns = 'my-transfer-ctrl';

  const props = defineProps<TransferCtrlProps>();

  const emit = defineEmits({
    change: (direction: TransferDirectionType) =>
      ['left', 'right'].includes(direction),
  });

  function handleSwitchButtonClick(direction: TransferDirectionType) {
    emit('change', direction);
  }

</script>

<template>
  <div :class="ns">
    <button
      :class="[
        `${ns}-btn`,
        props.leftButtonDisabled ? `${ns}-btn-disabled` : ''
      ]"
      data-direction="right"
      :disabled="props.leftButtonDisabled || props.disabled"
      @click="handleSwitchButtonClick('right')"
    >
      <right-arrow-icon class="transfer-button-icon" />
    </button>
    <button
      :class="[
        `${ns}-btn`,
        props.rightButtonDisabled ? `${ns}-btn-disabled` : ''
      ]"
      data-direction="left"
      :disabled="props.rightButtonDisabled || props.disabled"
      @click="handleSwitchButtonClick('left')"
    >
      <left-arrow-icon class="transfer-button-icon" />
    </button>
  </div>
</template>