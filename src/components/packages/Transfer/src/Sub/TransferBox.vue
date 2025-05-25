<script setup lang="ts">
  import { computed } from 'vue';

  import MyInput from '../../../Input/src/Input.vue';
  import MyCheckbox from '../../../Checkbox/src/Checkbox.vue';

  import {
    TransferCheckAllType,
    TransferDirectionType,
    TransferItem,
  } from '../../types';

  const ns = 'my-transfer-box';

  interface TransferBoxProps {
    disabled: boolean;
    direction: TransferDirectionType;
    showTitle: boolean;
    titles: string | string[];
    checkedAllValue: boolean;
    checkedValue: (string | number)[];
    showData: TransferItem[];
    allowSearch: boolean;
    searchValue: string;
    allowClear: boolean;
    searchPlaceholder: string | [string, string];
  }

  defineOptions({ name: 'MyTransferBox' });

  const props = defineProps<TransferBoxProps>();

  const navTitle = computed(() => {
    switch (props.direction) {
      case 'left':
        if (Array.isArray(props.titles)) {
          return props.titles?.[0] || '列表1';
        }
        if (typeof props.titles === 'string') {
          return props.titles;
        }
        return '列表1';
      case 'right':
        if (Array.isArray(props.titles)) {
          return props.titles?.[1] || props.titles?.[0] || '列表2';
        }
        if (typeof props.titles === 'string') {
          return props.titles;
        }
        return '列表2';
      default:
        return '-';
    }
  });

  const emit = defineEmits({
    change: (
      direction: TransferDirectionType,
      value: boolean,
      item: TransferItem
    ) => true,
    'change-search-value': (newValue: string, direction: TransferDirectionType) =>
      typeof newValue === 'string' && typeof direction === 'string',
    'checked-all-change': (field: TransferCheckAllType) => typeof field === 'string',
  });

  function handleValueChange(
    direction: TransferDirectionType,
    value: boolean,
    item: TransferItem,
  ) {
    emit('change', direction, value, item);
  }

  function handleSearchValueChange(value: string) {
    emit('change-search-value', value, props.direction);
  }

  function handleCheckedAllValueChange(newValue: boolean) {
    if (newValue) {
      emit('checked-all-change', TransferCheckAllType.ALL);
    } else {
      emit('checked-all-change', TransferCheckAllType.NONE);
    }
  }

</script>

<template>
  <div :class="[ns, `${ns}-left`]">
    <div :class="`${ns}-top`">
      <nav :class="`${ns}-nav`" v-if="props.showTitle">
        <my-checkbox
          :class="`${ns}-nav-title`"
          :disabled="props.disabled"
          :label="navTitle"
          :model-value="props.checkedAllValue"
          :indeterminate="checkedValue.length > 0 && !props.checkedAllValue"
          @change="handleCheckedAllValueChange"
        />
        <span :class="`${ns}-nav-stats`">
          ( {{ `${checkedValue.length} / ${showData.length}` }} )
        </span>
      </nav>
      <div :class="`${ns}-search`" v-if="props.allowSearch">
        <my-input
          :class="`${ns}-search-input`"
          :disabled="props.disabled"
          :model-value="props.searchValue"
          @update:model-value="handleSearchValueChange"
          type="text"
          allow-clear
          :placeholder="
            typeof props.searchPlaceholder === 'string'
              ? props.searchPlaceholder
              : props.searchPlaceholder?.[0]
          "
        />
        <i class="iconfont icon-search" />
      </div>
    </div>
    <div v-if="!showData.length" style="height: 200px; text-align: center; padding: 20px; box-sizing: border-box;">
      ----- NO DATA -----
    </div>
    <template v-else>
      <ul :class="`${ns}-list`">
        <li
          v-for="item in showData"
          :key="item.key"
          :class="[`${ns}-list-item`]"
          :draggable="!(item.disabled || props.disabled)"
        >
          <my-checkbox
            :disabled="item.disabled || props.disabled"
            :label="item.label"
            :model-value="checkedValue.includes(item.key)"
            @change="value => handleValueChange(props.direction, value, item)"
          />
          <i class="iconfont icon-right" />
        </li>
      </ul>
    </template>
  </div>
</template>