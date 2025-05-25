<script lang="ts" setup>
  import { computed } from 'vue';

  import * as constant from '../modules/constant';
  import {
    useTransferData,
    useSelectedKeys,
    useAllSearchValue,
    useAllShowData,
    useAllCheckedValueControllers,
  } from '../modules/hooks';
  import { TransferDirectionType, TransferItem } from '../types';
  import { addElementToArray, removeElementFromArray } from '../modules/utils';

  import MyTransferCtrl from './Sub/TransferCtrl.vue';
  import MyTransferBox from './Sub/TransferBox.vue';

  defineOptions({ name: 'MyTransfer' });

  const ns = 'my-transfer';
  const props = defineProps(constant.transferProps);
  const emit = defineEmits(constant.transferEmits);

  const transferData = useTransferData(props);
  const selectedKeys = useSelectedKeys(props);

  const [leftSearchValue, rightSearchValue, changeSearchValue] = useAllSearchValue();

  const [leftShowData, rightShowData] = useAllShowData({
    data: transferData,
    selectedKeys,
    allowSearch: computed(() => props.allowSearch),
    leftSearchValue,
    rightSearchValue,
  });

  const [leftCheckedController, rightCheckedController] = useAllCheckedValueControllers({
    data: transferData,
    selectedKeys,
    allowSearch: computed(() => props.allowSearch),
    leftSearchValue,
    rightSearchValue,
  });

  const leftButtonDisabled = computed(() =>
    !leftShowData.value.length || !leftCheckedController.checkedValue.value.length
  );

  const rightButtonDisabled = computed(() =>
    !rightShowData.value.length || !rightCheckedController.checkedValue.value.length
  );

  function handleValueChange(
    direction: TransferDirectionType,
    value: boolean,
    item: TransferItem,
  ) {
    switch (direction) {
      case 'left':
        !!value ? leftCheckedController.add(item.key) : leftCheckedController.remove(item.key);
        break;
      case 'right':
        !!value ? rightCheckedController.add(item.key) : rightCheckedController.remove(item.key);
        break;
      default:
        break;
    }
  }

  function handleSwitchButtonClick(direction: TransferDirectionType) {
    switch (direction) {
      case 'right':
        {
          // 添加元素
          const addKeys: (string | number)[] = leftCheckedController.checkedValue.value;
          const selectedKeysValue = selectedKeys.value;
          addElementToArray(selectedKeysValue, addKeys);
          selectedKeys.value = selectedKeysValue;
          leftCheckedController.clear();
        }
        break;
      case 'left':
        {
          // 删除元素
          const removeKeys: (string | number)[] = rightCheckedController.checkedValue.value;
          let selectedKeysValue = selectedKeys.value;
          selectedKeysValue = removeElementFromArray(selectedKeysValue, removeKeys);
          selectedKeys.value = selectedKeysValue;
          rightCheckedController.clear();
        }
        break;
      default:
        break;
    }
  }

</script>

<template>
  <div :class="[ns, props.disabled ? `${ns}-disabled` : '']">
    <my-transfer-box
      direction="left"
      :disabled="props.disabled"
      :show-title="props.showTitle"
      :titles="props.titles"
      :checked-all-value="leftCheckedController.checkedAllValue.value"
      :checked-value="leftCheckedController.checkedValue.value"
      :show-data="leftShowData"
      :allow-search="props.allowSearch"
      :search-placeholder="props.searchPlaceholder"
      :search-value="leftSearchValue"
      :allow-clear="true"
      @change="handleValueChange"
      @change-search-value="changeSearchValue"
      @checked-all-change="leftCheckedController.operateAll"
    />
    <my-transfer-ctrl
      :disabled="props.disabled"
      :left-button-disabled="leftButtonDisabled"
      :right-button-disabled="rightButtonDisabled"
      @change="handleSwitchButtonClick"
    />
    <my-transfer-box
      direction="right"
      :disabled="props.disabled"
      :show-title="props.showTitle"
      :titles="props.titles"
      :checked-all-value="rightCheckedController.checkedAllValue.value"
      :checked-value="rightCheckedController.checkedValue.value"
      :show-data="rightShowData"
      :allow-search="props.allowSearch"
      :search-placeholder="props.searchPlaceholder"
      :search-value="rightSearchValue"
      :allow-clear="true"
      @change="handleValueChange"
      @change-search-value="changeSearchValue"
      @checked-all-change="rightCheckedController.operateAll"
    />
  </div>
</template>