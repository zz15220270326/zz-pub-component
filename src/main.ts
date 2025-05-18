import { createApp } from 'vue';
import App from './App.vue';
import { Card } from '@/components';

import './styles/index.scss';

const app = createApp(App);

app.use(Card);

app.mount('#app');
