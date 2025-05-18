import { defineComponent } from 'vue';
import type { App, ComponentOptions, DefineComponent } from 'vue';

export const defineInstallComponent = <T extends DefineComponent<any, any, any, any>>(
  options: Partial<ComponentOptions<any, any, any, any>>,
) => {
  const Comp = <T & { install(app: App): void }> defineComponent(options);

  Comp.install = function (app: App) {
    app.component(Comp.name || Comp.displayName, Comp);
  }

  return Comp;
}