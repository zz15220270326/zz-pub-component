import type { App } from 'vue';

import Card from './src/Card';

Card.install = function (app: App) {
  app.component(Card.name as string, Card);
}

export default Card as (typeof Card & {
  install(app: App): void;
});

export { Card };

export type * from './util/types';
