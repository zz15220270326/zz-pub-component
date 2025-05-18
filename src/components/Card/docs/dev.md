> 使用 Vue3 + Tsx 实现一个卡片组件 
>（参考 [`Element-Plus`](https://element-plus.gitee.io/zh-CN/component/card.html)）

# 前置背景：
最近项目组在逐步使用 `Vue3` + `Tsx` 进行开发，本文想通过一个卡片组件的开发，来感受一下 `Vue3.0 + Tsx` 的开发体验。其中包括了：
- [x] 声明组件
- [x] 组件的 `props` 校验
- [x] `Tsx` 中使用插槽
- [x] `Tsx` 中使用自定义指令

# 开发前准备：
首先，我们需要准备一个 `Vue3.0` 的开发环境，本文采用 `Vite` 从零开始搭建一个项目。

1. 准备一个空的文件夹，使用终端打开该文件夹，并执行以下命令：
```sh
$ npm init -y # 初始化 package.json 文件
```

2. 安装一些开发依赖和生产依赖：

- 手动安装
```sh
# 开发依赖安装
npm i -D @types/node vite @vitejs/plugin-vue @vitejs/plugin-vue-jsx typescript@4.x @vue/babel-preset-jsx vue@3.x sass
```

- 或者，复制这里的 `package.json` 文件，然后直接 `npm i` 安装：
```json
{
  "name": "vite-tsx",
  "version": "1.0.0",
  "description": "",
  "main": "src/main.ts",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^20.11.28",
    "@vitejs/plugin-vue": "^5.0.4",
    "@vitejs/plugin-vue-jsx": "^3.1.0",
    "@vue/babel-preset-jsx": "^1.4.0",
    "sass": "^1.72.0",
    "typescript": "4.x",
    "vite": "^5.1.6",
    "vue": "^3.4.21"
  },
  "peerDependencies": {
    "vue": "^3.3"
  }
}
```

3. 在根目录下面创建以下几个文件：`vite.config.ts`, `tsconfig.json`, `vue-shims.d.ts`, `global.d.ts`
```ts
/* vite.config.ts */

import { defineConfig } from 'vite';
import { resolve } from 'path';
import vuePlugin from '@vitejs/plugin-vue';
import vueJsxPlugin from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [vuePlugin(), vueJsxPlugin()],
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
    extensions: [
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
    ],
  },
});
```

```json
/* tsconfig.json */

{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true,
    "lib": [
      "esnext",
      "dom"
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "jsx": "preserve",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment",
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "declaration": true,
    "esModuleInterop": true,
    "types": ["vue/jsx"]
  },
  "exclude": ["node_modules"],
  "include": [
    "./src/**/*.ts",
    "./src/**/*.tsx",
    "./src/**/*.vue",
    "./**/*.d.ts"
  ]
}
```

```ts
/* vue-shims.d.ts */

import { DefineComponent, VNode } from 'vue';

declare module '*.vue' {

  // 定义组件
  const component: DefineComponent<Record<string, any>, Record<string, any>, any>;

  export default component;
}

declare namespace JSX {
  // 定义JSX
  interface Element extends VNode {}

  interface ElementClass extends DefineComponent<any, any, any> {}

  interface IntrinsicElements {
    // 定义自定义元素
    'my-custom-element': any;

    // 定义其他元素
    // ...
    div: any;
    span: any;
    h1: any;
    h2: any;
    h3: any;
    h4: any;
    h5: any;
    h6: any;
    p: any;
    hr: any;
    br: any;
    a: any;
    img: any;
    button: any;
  }
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

```

```ts
/* global.d.ts */

// 声明 css 样式
declare module '*.css' {
  const content: { [className: string]: string };
}
// 声明 scss 样式
declare module '*.scss' {
  const content: { [className: string]: string };
}

// 声明图片
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

// 声明 markdown
declare module '*.md';
```

4. 创建 `index.html`, 并编写一下文件：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vite + TSX</title>
</head>
<body>
  <div id="app"></div>

  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

5. 创建 `src/main.ts` 和 `src/App.vue`，编写一下基本的架子：

```ts
// src/main.ts

import { createApp } from 'vue';
import App from './App.vue';

import './styles/index.scss';

const app = createApp(App);

app.mount('#app');
```

```html
<!-- src/App.vue -->
<script lang="ts" setup>
  console.log('App.vue');
</script>

<template>
  <h1>Hello Vue3 + Tsx</h1>
</template>
```

6. 在 `package.json` 中添加一下 `vite` 运行和部署相关的命令，并运行 `npm run dev` 启动项目：
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  }
}
```

7. 在 chrome 浏览器地址栏输入 `http://localhost:5173` 打开项目，如果能够看到大大的 `Hello Vue3 + Tsx` 字样，那么恭喜你，项目已经成功运行起来了。

# 组件设计
搭建如下的项目结构：
```
├── src
│   ├── main.ts
│   ├── App.vue
│   ├── components
│   │   ├── index.ts           # 所有组件的出口
│   │   └── Card
│   │       ├── index.ts       # 组件导出的出口
│   │       └── Card.tsx       # 组件实现
│   │       └── types.ts       # 组件类型声明
│   │       └── config.js      # 组件用到的配置
│   │       └── vCardShadow.ts # 控制卡片阴影的指令
│   ├── styles
│   │   └── index.scss
│   │   └── Card
│   │       └── index.scss     # 组件的样式
│   │       └── ...            # 其他组件的样式
```

# 代码实现
1. 先编写 `components/index.ts`, 导出 `Card` 组件本身及其 props

```ts
export { default as Card } from './Card';

export type { CardProps } from './Card';
```

2. 编写 `Card` 组件的出口：
```ts
import type { App } from 'vue';

import Card from './Card';

Card.install = function (app: App) {
  app.component(Card.name, Card);
}

export default Card;

export type * from './types';
```

3. 创建配置文件 `config.ts` 和类型文件 `types.ts` (主要是定义 `props` 和 `slots`)
```ts
/* config.ts */
import type { CSSProperties, PropType } from 'vue';

/** 触发的方式 */
export type TriggerShadowWay = 'always' | 'hover' | 'never';

/** `Card` 组件的 `props` 定义 */
export const cardProps = {
  /** 卡片的标题 */
  header: {
    type: String,
    default: '',
  },
  /** 卡片页脚 */
  footer: {
    type: String,
    default: '',
  },
  /** body 的 CSS 样式  */
  bodyStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  /** body 的自定义类名 */
  bodyClass: {
    type: String,
    default: '',
  },
  /** 卡片阴影显示时机 */
  shadow: {
    type: String as PropType<TriggerShadowWay>,
    default: 'always',
    validator: (v: string | undefined): boolean => {
      if (v === undefined) {
        v = 'always';
      }
      return ['always', 'hover', 'never'].includes(v);
    }
  },
} as const;
```

```ts
/* types.ts */
import { cardProps } from './configs';
export type { TriggerShadowWay } from './configs';

/** 卡片内部的插槽定义 */
export type CardSlotsType = SlotsType<{
  /** `main` 主要区域渲染内容 */
  default: undefined | (() => VNode | VNode[] | undefined);
  /** `header` 顶部渲染内容 */
  header: undefined | (() => VNode | VNode[] | undefined);
  /** `footer` 底部渲染内容 */
  footer: undefined | (() => VNode | VNode[] | undefined);
}>;

/** 卡片的 Props 定义 */
export type CardProps = ExtractPropTypes<typeof cardProps>;
```

4. 编写核心组件文件 `Card.tsx`：
```ts
import { computed, defineComponent } from 'vue';
import type { VNode } from 'vue';

export default defineComponent({
  name: 'MyCard',
  props: cardProps,
  slots: Object as CardSlotsType,
  setup(props, { slots, attrs, /* expose, */ /* emit */ }) {
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

    return () => (
      <div class="my-card" {...attrs}>
        {cardHeader.value}
        {cardContent.value}
        {cardFooter.value}
      </div>
    );
  }
});
```

5. 编写自定义指令 `vCardShadow`, 并在 `MyCard` 组件中使用该指令。
```ts
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
```

```tsx
import { computed, defineComponent, withDirectives } from 'vue';
import type { VNode } from 'vue';

import { cardProps } from './configs';
import type { CardSlotsType } from './types';

import vCardShadow from './vCardShadow';

export default defineComponent({
  name: 'MyCard',
  props: cardProps,
  slots: Object as CardSlotsType,
  setup(props, { slots, attrs, /* expose, */ /* emit */ }) {
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
```

6. 最后编写一下样式 （我这里使用的是 `scss`）：

```scss
/* styles/index.scss */
@import "./Card/index.scss";
```

```scss
/* styles/Card/index.scss */
.my-card {
  position: relative;
  width: 500px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  border-radius: 3px;
  transition: shadow .25s ease-in;

  &-shadow {
    border: none;
    box-shadow: 1px 3px 5px #9d9d9d;
  }

  &-header {
    width: 100%;
    height: 44px;
    padding: 8px;
    line-height: 30px;
    vertical-align: center;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
  }

  &-footer {
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 8px;
    line-height: 30px;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
  }

  &-content {
    width: 100%;
    max-height: 500px;
    min-height: 60px;
    height: calc(100% - 88px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;

    &:hover {
      &::-webkit-scrollbar {
        display: block;
      }
    }

    // 设置盒子滚动条的样式
    &::-webkit-scrollbar {
      z-index: 9999;
      width: 8px; // 水平滚动条的宽度
      height: 8px; // 垂直滚动条的高度
      border-radius: 5%;
      display: none;
      transition: all .25s ease-in;
    }

    // 设置滚动条滑块的上边距
    &::-webkit-scrollbar-thumb {
      margin-bottom: -20px;
      background-color: #888; // 滚动条的滑块颜色
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background-color: #f1f1f1; // 滚动条的背景颜色
    }
  }
}
```

# 测试用例

## 注册组件
1. 首先，我们需要在 `src/main.ts` 中注入我们写好的组件及其样式：
```ts
import { createApp } from 'vue';
import App from './App.vue';

+ import { Card } from './components';

import './styles/index.scss';

const app = createApp(App);

+ app.use(Card);

app.mount('#app');

```

## 使用组件

- 测试案例一 (基本使用)：
```html
<template>
  <my-card style="max-width: 480px">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
      </div>
    </template>
    <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
    <template #footer>Footer content</template>
  </my-card>
</template>
```

- 测试案例二 (简单卡片)：
```html
<template>
  <my-card style="max-width: 480px">
    <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
  </my-card>
</template>
```

- 测试案例三 （有图片内容的卡片）
```html
<template>
  <my-card style="max-width: 480px">
    <template #header>Yummy hamburger</template>
    <img
      src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
      style="width: 100%"
    />
  </my-card>
</template>
```

- 测试案例四 （带有阴影效果的卡片）
```html
<template>
  <div class="flex flex-wrap gap-4">
    <my-card style="width: 480px" shadow="always">Always</my-card>
    <my-card style="width: 480px" shadow="hover">Hover</my-card>
    <my-card style="width: 480px" shadow="never">Never</my-card>
  </div>
</template>
```

# 完整代码
