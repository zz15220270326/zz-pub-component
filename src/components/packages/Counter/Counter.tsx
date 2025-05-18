import { computed, defineComponent, ref } from 'vue';
import type { CounterSlotsType } from './types';

/*  */
// console.log(withDefaults(defineProps<Partial<CounterProps>>(), {
//   count: 1,
// }));

export default defineComponent({
  name: 'Counter',
  props: {
    count: {
      type: Number,
      default: 0,
    },
  },
  slots: Object as CounterSlotsType,
  setup(props, { slots }) {
    const count = ref(props.count);

    function addCount() {
      count.value += 1;
    }

    const slotArgs = computed<typeof props>(() => {
      return { ...props, count: count.value };
    })

    return () => (
      <div class="counter">
        {
          slots.header
            ? slots.header?.(slotArgs.value)
            : <h1>Counter</h1>
        }

        <button class="btn" onClick={addCount}>You click me { count.value } times</button>

        {slots.default?.(slotArgs.value)}
      </div>
    );
  },
});
