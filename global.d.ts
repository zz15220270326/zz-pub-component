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