import { computed } from 'vue';
import type { VNode } from 'vue';
import type { CardProps, CardSlots } from './types';

export function useCardSlots(props: CardProps, slots: CardSlots) {
  const cardHeader = computed<VNode|string>(() => {
    if (!slots.header && !props.header.length) {
      return '';
    }

    return (
      <header class="my-card-header">
        {slots.header?.() ?? props.header}
      </header>
    );
  });

  const cardContent = computed<VNode|string>(() => {
    return (
      <div class="my-card-content">
        {slots.default?.()}
      </div>
    );
  })

  const cardFooter = computed<VNode|string>(() => {
    if (!slots.footer && !props.footer.length) {
      return '';
    }
    return (
      <footer class="my-card-footer">
        {slots.footer?.() ?? props.footer}
      </footer>
    );
  });

  return [
    cardHeader,
    cardContent,
    cardFooter,
  ];
}