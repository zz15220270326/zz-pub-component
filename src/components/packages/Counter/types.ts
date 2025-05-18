import { ExtractPropTypes, SlotsType, VNode } from 'vue';

const counterProps = {
  count: {
    type: Number,
    default: 0,
  },
};

// export interface CounterProps {
//   count: number;
// }
// export type CounterProps = ExtractPropTypes<typeof counterProps>;
export interface CounterProps extends ExtractPropTypes<typeof counterProps> {}

export interface CounterSlotsType extends SlotsType {
  default?: (props: CounterProps) => VNode | VNode[];

  // 添加其他可能的自定义插槽
  header?: (props: CounterProps) => VNode | VNode[];
}
