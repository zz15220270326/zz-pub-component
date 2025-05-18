import type { CSSProperties, PropType } from 'vue';

/** 触发的方式 */
export type TriggerShadowWay = 'always' | 'hover' | 'never';

/** `Card` 组件的 `props` 定义 */
export const cardProps = {
  /** 卡片的标题 */
  header: {
    type: String,
    default: '',
  },
  /** 卡片页脚 */
  footer: {
    type: String,
    default: '',
  },
  /** body 的 CSS 样式  */
  bodyStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  /** body 的自定义类名 */
  bodyClass: {
    type: String,
    default: '',
  },
  /** 卡片阴影显示时机 */
  shadow: {
    type: String as PropType<TriggerShadowWay>,
    default: 'always',
    validator: (v: string | undefined): boolean => {
      if (v === undefined) {
        v = 'always';
      }
      return ['always', 'hover', 'never'].includes(v);
    }
  },
} as const;
