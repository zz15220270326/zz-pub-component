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
