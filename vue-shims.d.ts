import { App, DefineComponent, VNode } from 'vue';

declare module '*.vue' {
  // 定义组件
  const component: DefineComponent<Record<string, any>, Record<string, any>, any>;

  export default component;
}

declare module "@vue/jsx-runtime" {
  export interface HTMLAttributes {
    // 添加自定义属性
    dataTest?: string;

    // 添加其他属性
    // ...
  }

  export interface IntrinsicElements {
    // 添加自定义元素
    'my-custom-element': HTMLAttributes;
    // 添加其他元素
    // ...
  }
  
  // 添加其他类型
  // ...

  // 添加其他模块
  // ...
}
