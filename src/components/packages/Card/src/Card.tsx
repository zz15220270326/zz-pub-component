import { defineComponent, withDirectives } from 'vue';

import { cardProps } from '../util/configs';
import type { CardSlotsType } from '../util/types';

import vCardShadow from '../util/vCardShadow';
import { useCardSlots } from '../util/hooks';

export default defineComponent({
  name: 'MyCard',
  props: cardProps,
  slots: Object as CardSlotsType,
  setup(props, { slots, attrs, /* expose, */ /* emit */ }) {
    const [cardHeader, cardContent, cardFooter] = useCardSlots(props, slots);

    return () => withDirectives(
      <div class="my-card" {...attrs}>
        {cardHeader.value}
        {cardContent.value}
        {cardFooter.value}
      </div>,
      [
        [vCardShadow, props]
      ],
    );
  }
});
