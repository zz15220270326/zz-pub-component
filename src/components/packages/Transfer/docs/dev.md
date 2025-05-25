```
  Author: Zhangsan
  Date: 2025-05-25
  Description: Transfer 组件开发文档
```

# 前言
## 什么是穿梭框组件
**穿梭框 （Transfer）** 是一种在一组备选项中进行多选并且左右移动选择的组件。

## 为什么需要穿梭框组件
穿梭框组件通常用于在两个列表之间进行数据的选择和移动，例如在用户管理中，需要从一组用户中选择一部分用户进行操作，这时就可以使用穿梭框组件。

## 穿梭框组件的用途
穿梭框组件通常用于以下场景：

- 用户管理：在用户管理中，需要从一组用户中选择一部分用户进行操作，例如分配权限、删除用户等。
- 数据筛选：在数据筛选中，需要从一组数据中选择一部分数据进行展示，例如在表格中筛选数据。

## 本次用到的技术栈

| 技术栈名称 | 技术栈说明 |
| --------- | --------- |
| Vue3.0 | Vue.js v3 版本，基于 `<script setup>` |
| TypeScript | JavaScript 模拟强类型语言的超集 |
| Functional Programming | 函数式编程 |

# 首先，我们需要什么？

1. 需要对 Vue3.0 组件库封装, TypeScript 使用，Functional Programming 有一定的了解
1. 需要一个 Vue3.0 + TypeScript 的工程 （本文使用的是 vite 工程）

> ## 温馨提示
> 如果没有 Vue3 项目，可以参考 **[以往的文档](https://juejin.cn/post/7377647067576844340)**

# 参数 & 配置

## Props
| **属性名** | **说明** | **类型** | **默认值** |
| ---------- | -------- | -------- | --------- |
| **data** | 数据源, <a href="#Type-TransferItem">定义参考</a>TransferItem | `TransferItem[]` | `[]` |
| **modelValue / v-model** | 数据源中的唯一标识字段名 | `(string \| number)[]` | `[]` |
| **allowSearch** | 是否显示搜索框 | `boolean` | `false` |
| **searchPlaceholder** | 搜索框占位符 (仅在 `allowSearch = true` 下生效) | `string` | `'请输入搜索内容'` |
| **showTitle** | 是否展示盒子标题栏 | `boolean` | `true` |
| **titles** | 标题栏内容 | `string[] \| string` | `['源数据', '目标数据']` |
| **disabled** | 是否禁用穿梭框 | `boolean` | `false` |

## Emits
| **属性名** | **说明** | **类型** | **默认值** |
| ---------- | -------- | -------- | --------- |
| **update:modelValue** | 数据变化时触发的事件处理函数 |  |  |
|  |  |  |  |

# 程序设计
程序设计包含以下几个部分：

1. [组件设计](#H2-component)
1. [模块设计](#h2-module)
1. [类型设计](#h2-type)

<h2 id="H2-component">组件设计</h2>

Transfer 的组件结构如下：

```sh
Transfer/src
  ├── Transfer          # Transfer 组件
    ├── TransferBox     # Transfer 左右盒子
      ├── TransferTitle # Transfer 标题栏
      ├── TransferList  # Transfer 列表
    ├── TransferEmpty     # Transfer 数据为空展示的内容

  ├── TransferCtrl      # Transfer 控制栏
    ├── TransferSearch  # Transfer 搜索栏
```

<h2 id="h2-module">模块设计</h2>

```sh
Transfer/modules
  ├── constant  # Transfer 组件的配置常量
  ├── hooks     # Transfer 组件的 hooks
  ├── utils     # Transfer 组件的工具函数
```

<h2 id="h2-type">类型设计</h2>

<h3 id="Type-TransferItem">TransferItem 定义</h3>

```ts
interface TransferItem {
  key: string | number;
  label: string;
  disabled?: boolean;
}
```

## 整体结构输出
```sh
Transfer
  Transfer/src
    ├── Transfer          # Transfer 组件
      ├── TransferBox     # Transfer 左右盒子
        ├── TransferTitle # Transfer 标题栏
        ├── TransferList  # Transfer 列表
      ├── TransferEmpty     # Transfer 数据为空展示的内容

    ├── TransferCtrl      # Transfer 控制栏
      ├── TransferSearch  # Transfer 搜索栏

  Transfer/modules
    ├── constant  # Transfer 组件的配置常量
    ├── hooks     # Transfer 组件的 hooks
    ├── utils     # Transfer 组件的工具函数
```

# 代码实现
## 1. 常量定义

```ts
// modules/constant.ts

import { PropType } from 'vue';
import {
  TransferItem,
  TransferDirectionType,
  TransferCheckAllType,
} from '../types';

export const transferProps = {
  /**
   * @description 数据源
   */
  data: {
    type: Array as PropType<TransferItem[]>,
    default: () => [],
  },
  /**
   * @description 数据源中的唯一标识字段名
   */
  modelValue: {
    type: Array as PropType<(string | number)[]>,
    default: () => [],
  },
  /**
   * @description 是否显示搜索框
   */
  allowSearch: {
    type: Boolean,
    default: false,
  },
  /**
   * @description 搜索框占位符 (仅在 `allowSearch = true` 下生效)
   */
  searchPlaceholder: {
    type: [String, Array] as PropType<string | [string, string]>,
    default: '请输入搜索内容',
  },
  /**
   * @description 是否展示盒子标题栏
   */
  showTitle: {
    type: Boolean,
    default: true,
  },
  /**
   * @description 标题栏内容
   */
  titles: {
    type: Array as PropType<string[] | string>,
    default: () => ['源数据', '目标数据'],
  },
  /**
   * @description 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

export const transferEmits = {
  /**
   * @description 数据变化时触发
  */
  'update:modelValue': (value: (string | number)[]) =>
    typeof value === 'string' || Array.isArray(value),
  change: (value: (string | number)[]) =>
    typeof value === 'string' || Array.isArray(value),
} as const;

export const transfrerBoxEmits = {
  change: (
    direction: TransferDirectionType,
    value: boolean,
    item: TransferItem
  ) => (
    typeof direction === 'string'
      && typeof value === 'boolean'
      && typeof item === 'object' && item !== null
  ),
  'change-search-value': (newValue: string, direction: TransferDirectionType) =>
    typeof newValue === 'string' && typeof direction === 'string',
  'checked-all-change': (field: TransferCheckAllType) => typeof field === 'string',
} as const;
```

## 2. 类型定义

```ts
// types.ts

import type { ComputedRef, ExtractPropTypes, Ref } from 'vue';
import { transferProps } from './modules/constant';

export interface TransferItem {
  key: string | number;
  label: string;
  disabled?: boolean;
}

export interface TransferGroupItem {
  label: string;
  children: TransferItem[];
}

export type TransferDirectionType = 'left' | 'right';

export type TransferProps = ExtractPropTypes<typeof transferProps>;

export type TransferType = (
  | 'legacy'
  | 'group'
);

export interface UseShowDataOptions {
  selectedKeys: Ref<(string | number)[]>;
  data: Ref<TransferItem[]>;
  direction: TransferDirectionType;
  allowSearch: ComputedRef<boolean>;
  searchValue: Ref<string>;
}

export type UseAllShowDataOptions = Omit<UseShowDataOptions, 'direction' | 'searchValue'> & {
  leftSearchValue: Ref<string>;
  rightSearchValue: Ref<string>;
};

export interface UseCheckedValueControllerOptions {
  direction: TransferDirectionType;
  data: Ref<TransferItem[]>;
}

export type UseAllCheckedValueControllersOptions = (
  & Omit<UseCheckedValueControllerOptions, 'direction'>
  & UseAllShowDataOptions
);

export enum TransferCheckAllType {
  // 全选
  ALL = 'all',
  // 全不选
  NONE = 'none',
  // 部分选中
  PART = 'part',
}

```

## 3. 组件定义
我们需要把组件都定义出来

- `src/Transfer.vue`

```html
<script lang="ts" setup>
  defineOptions({ name: 'MyTransfer' });

  const const ns = 'my-transfer';
</script>

<template></template>
```

- `src/Sub/TransferBox.vue`

```html
<script setup lang="ts">
  import { computed } from 'vue';

  import MyInput from '../../../Input/src/Input.vue';
  import MyCheckbox from '../../../Checkbox/src/Checkbox.vue';

  import { transfrerBoxEmits } from '../../modules/constant';
  import {
    TransferCheckAllType,
    TransferDirectionType,
    TransferItem,
  } from '../../types';

  import MyTransferEmpty from './TransferEmpty.vue';

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

  const emit = defineEmits(transfrerBoxEmits);

  const indeterminate = computed(() => {
    if (props.checkedValue.length && !props.checkedAllValue) {
      return true;
    }
    return false;
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
          :indeterminate="indeterminate"
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
      <my-transfer-empty />
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
            :model-value="
              checkedValue.includes(item.key)
              || props.direction === 'right' && item.disabled
            "
            @change="value => handleValueChange(props.direction, value, item)"
          />
          <i class="iconfont icon-right" />
        </li>
      </ul>
    </template>
  </div>
</template>
```

- `src/Sub/TransferCtrl.vue`

```html
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
```

- `src/Sub/TransferEmpty.vue`

```html
<script setup lang="ts">
  defineOptions({ name: 'MyTransferEmpty' });
</script>

<template>
  <div class="my-empty">
    <svg
      class="empty-icon"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
        fill="#BDBDBD"
      />
    </svg>
    <p class="empty-text">暂无数据</p>
  </div>
</template>

<style scoped>
  .my-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .empty-icon {
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 14px;
    color: #757575;
  }
</style>
```

## 4. 模块实现

1. 准备工具函数
```ts
// modules/utils.ts

export function getFilteredData<T extends { label: string }>(
  data: T[],
  searchValue: string,
): T[] {
  return data.filter(item => {
    const itemLabel = item.label.toLowerCase();
    if (!searchValue.trim().length) return true;
    return itemLabel.includes(searchValue.toLowerCase());
  });
}

export function filterDataByKeys<T extends { key: string | number }>(
  data: T[],
  keys: (string | number)[],
  field: 'selected' | 'unselected' = 'selected'
): T[] {
  if (field === 'unselected') {
    return data.filter(item => keys.every(key => key !== item.key));
  }
  return data.filter(item => keys.some(key => key === item.key));
}

export function addElementToArray<T>(result: T[], value: T | T[]) {
  if (Array.isArray(value)) {
    for (let item of value) {
      if (result.includes(item)) continue;
      result.push(item);
    }
  } else {
    if (result.includes(value)) return;
    result.push(value);
  }
  return result;
}

export function removeElementFromArray<T>(result: T[], value: T | T[]) {
  let newResult: T[] = [];
  if (Array.isArray(value)) {
    newResult = result.filter((item) => !value.includes(item));
  } else {
    newResult = result.filter((item) => item !== value);
  }
  return newResult;
}
```

2. 编写组建的逻辑

> - 本文采用函数式编程！
> - 这里将组件的数据视图驱动写到了 hooks 中，最后在根组件中接入这些 hooks 就行了

```ts
import { computed, onMounted, ref } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import type {
  TransferItem,
  UseAllShowDataOptions,
  UseShowDataOptions,
  UseCheckedValueControllerOptions,
  UseAllCheckedValueControllersOptions,
  TransferDirectionType,
} from '../types';
import { TransferCheckAllType } from '../types';
import {
  addElementToArray,
  removeElementFromArray,
  filterDataByKeys,
  getFilteredData,
} from './utils';

export function useTransferData<T extends { data: TransferItem[] }>(props: T) {
  const transferData = ref<TransferItem[]>([]);

  onMounted(() => {
    transferData.value = props.data;
  });

  return transferData;
}

export function useSelectedKeys<T extends { modelValue: (string | number)[] }>(props: T): Ref<(string | number)[]> {
  const selectedKeys = ref<(string | number)[]>([]);

  onMounted(() => {
    selectedKeys.value = [...props.modelValue];
  });

  return selectedKeys;
}


export function useAllSearchValue(): [
  Ref<string>,
  Ref<string>,
  (newValue: string, direction: TransferDirectionType) => void,
] {
  const [leftSearchValue, rightSearchValue] = [ref(''), ref('')];

  function changeSearchValue(newValue: string, direction: TransferDirectionType) {
    switch (direction) {
      case 'left':
        leftSearchValue.value = newValue;
        break;
      case 'right':
        rightSearchValue.value = newValue;
        break;
      default:
        break;
    }
  }

  return [leftSearchValue, rightSearchValue, changeSearchValue];
}

export function useShowData({
  direction,
  data,
  selectedKeys,
  allowSearch,
  searchValue,
}: UseShowDataOptions) {
  return computed<TransferItem[]>(() => {
    switch (direction) {
      case 'left':
        if (!selectedKeys.value.length) {
          if (allowSearch.value) {
            return getFilteredData(data.value, searchValue.value);
          } else {
            return data.value;
          }
        }
        if (allowSearch.value) {
          const filteredData = getFilteredData(data.value, searchValue.value);
          return filterDataByKeys(filteredData, selectedKeys.value, 'unselected');
        }
        return filterDataByKeys(data.value, selectedKeys.value, 'unselected');
      case 'right':
        if (!selectedKeys.value.length) return [];
        if (allowSearch.value) {
          const filteredData = getFilteredData(data.value, searchValue.value);
          return filterDataByKeys(filteredData, selectedKeys.value);
        }
        return filterDataByKeys(data.value, selectedKeys.value);
      default:
        return [];
    }
  });
}

export function useAllShowData({
  data,
  selectedKeys,
  allowSearch,
  leftSearchValue,
  rightSearchValue,
}: UseAllShowDataOptions
): [ComputedRef<TransferItem[]>, ComputedRef<TransferItem[]>] {
  const leftShowData = useShowData({
    direction: 'left',
    data,
    selectedKeys,
    allowSearch,
    searchValue: leftSearchValue,
  });
  const rightShowData = useShowData({
    direction: 'right',
    data,
    selectedKeys,
    allowSearch,
    searchValue: rightSearchValue,
  });
  return [leftShowData, rightShowData];
}

export function useCheckedValueController({
  direction, // 方向
  data, // 数据
}: UseCheckedValueControllerOptions) {
  const checkedValue = ref<(number | string)[]>([]);

  const checkedAllValue = computed(() => {
    if (!data.value.length || !checkedValue.value.length) return false;
    // return data.value.filter(item => !item.disabled).length <= checkedValue.value.length;
    return data.value.every(item => checkedValue.value.includes(item.key));
  })

  const clearCheckedValue = () => {
    checkedValue.value = [];
  }

  const addCheckedValue = (value: number | string | (string | number)[]) => {
    const result = checkedValue.value;
    addElementToArray(result, value);
    checkedValue.value = [...result];
  }

  const removeCheckedValue = (value: number | string | (string | number)[]) => {
    let result = checkedValue.value;
    result = removeElementFromArray(result, value);
    checkedValue.value = [...result];
  }

  const operateAll = (type: TransferCheckAllType) => {
    switch (type) {
      case TransferCheckAllType.ALL:
        checkedValue.value = data.value.map((item) => item.key);
        break;
      case TransferCheckAllType.NONE:
        checkedValue.value = [];
        break;
      default:
        break;
    }
  }

  return {
    checkedValue,
    checkedAllValue,
    direction,
    clear: clearCheckedValue,
    add: addCheckedValue,
    remove: removeCheckedValue,
    operateAll,
  };
}

export function useAllCheckedValueControllers({
  data,
  selectedKeys,
  allowSearch,
  leftSearchValue,
  rightSearchValue,
}: UseAllCheckedValueControllersOptions): [
  ReturnType<typeof useCheckedValueController>,
  ReturnType<typeof useCheckedValueController>
] {
  const [leftShowData, rightShowData] = useAllShowData({
    data,
    selectedKeys,
    allowSearch,
    leftSearchValue,
    rightSearchValue,
  });

  return [
    useCheckedValueController({ direction: 'left', data: leftShowData }),
    useCheckedValueController({ direction: 'right', data: rightShowData }),
  ];
}
```

## 5. 将模块接入到组件

- `src/Transfer.vue`

```html
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
```

# 完整代码
