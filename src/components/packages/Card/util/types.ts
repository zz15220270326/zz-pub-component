import type { ExtractPropTypes, SlotsType, VNode } from 'vue';

import { cardProps } from './configs';
export type { TriggerShadowWay } from './configs';

export interface CardSlots {
  /** `main` 主要区域渲染内容 */
  readonly default: undefined | (() => VNode | VNode[] | undefined);
  /** `header` 顶部渲染内容 */
  readonly header: undefined | (() => VNode | VNode[] | undefined);
  /** `footer` 底部渲染内容 */
  readonly footer: undefined | (() => VNode | VNode[] | undefined);
}

/** 卡片内部的插槽定义 */
export type CardSlotsType = SlotsType<CardSlots>;

/** 卡片的 Props 定义 */
export type CardProps = ExtractPropTypes<typeof cardProps>;