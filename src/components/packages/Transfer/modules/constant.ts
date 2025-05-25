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
