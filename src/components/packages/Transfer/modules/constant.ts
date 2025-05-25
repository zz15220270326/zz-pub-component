import { PropType } from 'vue';
import { TransferItem } from '../types';

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
  'update:modelValue': (value: (string | number)[]) =>
    typeof value === 'string' || Array.isArray(value),
  change: (value: (string | number)[]) =>
    typeof value === 'string' || Array.isArray(value),
} as const;
