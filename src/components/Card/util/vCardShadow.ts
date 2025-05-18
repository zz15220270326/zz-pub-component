import type { Directive } from 'vue';
import type { CardProps } from './types';

const vCardShadow: Directive<HTMLElement, CardProps> = {
  mounted(el, bindings, vNode) {
    switch (bindings.value.shadow) {
      case 'always':
        el.classList.add('my-card-shadow');
        break;
      case 'hover':
        el.addEventListener('mouseenter', handleContainerEnterLeave, false);
        el.addEventListener('mouseleave', handleContainerEnterLeave, false);
        break;
      case 'never':
      default:
        el.classList.remove('my-card-shadow');
        break;
    }
  }
};

function handleContainerEnterLeave(e: Event) {
  const eventType = e.type.toLowerCase();
  const el: HTMLElement = <HTMLElement> e.currentTarget;

  switch (eventType) {
    case 'mouseenter':
      el.classList.add('my-card-shadow');
      break;
    case 'mouseleave':
      el.classList.remove('my-card-shadow');
    default:
      break;
  }
}

export default vCardShadow;
