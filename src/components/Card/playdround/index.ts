import { defineAsyncComponent } from 'vue';

import Demo1 from './Demo1.vue';
import Demo2 from './Demo2.vue';
import Demo3 from './Demo3.vue';
import Demo4 from './Demo4.vue';

export default {
  Demo1: defineAsyncComponent(() => import('./Demo1.vue')),
  Demo2: defineAsyncComponent(() => import('./Demo2.vue')),
  Demo3: defineAsyncComponent(() => import('./Demo3.vue')),
  Demo4: defineAsyncComponent(() => import('./Demo4.vue')),
};

export {
  Demo1,
  Demo2,
  Demo3,
  Demo4,
};