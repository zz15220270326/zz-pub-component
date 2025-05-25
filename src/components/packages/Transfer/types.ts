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
