# postcss 插件

## luchaocss

```javascript
npm install luchaocss --save
```

### 配置文件
```javascript
// postcss.config.js
import luchaocss from 'luchaocss'
export default {
  plugins: [
    luchaocss({
       // class 名称前缀自定义，默认 "g"。如 g-m-10
      prefix: '',
      // 处理范围 content内包含的文件
      content: ['./index.html', "./src/**/*.{html,vue}"],
      /**
       * 自定义 class
       * .g-transition-linear {
       *    transition: "all 0.2s linear"
       * }
       * .g-color-333 {
       *    color: #333;
       * }
       * .g-color-666 {
       *    color: #666;
       * }
       */
      theme: {
        transition: {
          linear: 'all 0.2s linear'
        },
        color: {
          '333': '#333',
          '666': '#666',
        }
      }
    }),
  ]
}
```

### 使用
```javascript
// 全局css文件中加入以下语句
@luchaocss base; // 加载 reset css，非必须
@luchaocss utilities;  // 必须引入，自动生成的css将根据该语句写入此文件
```

```vue
<div class="g-p-10 g-color-333">luchaocss</div>

<div :class="['g-p-10', 'g-color-333', toggle ? 'g-d-b' : 'g-d-n', {"p-o-1": toggle}]">luchaocss</div>
```

### vscode扩展配合使用
安装扩展 luchaocss

## 文档
使用首字母缩写
| css | class | 说明 |
| ---- | ----- | ----- |
| margin: 10px | g-m-10 |
| margin-top: 10px | g-mt-10 |
| margin-top: 10px; margin-bottom: 10px; | g-mtb-10 | `tblr`顺序不敏感 |
| padding: 10px | g-p-10 |
| padding-top: 10px | g-pt-10 |
| padding-top: 10px; padding-bottom: 10px; | g-ptb-10 | `tblr`顺序不敏感 |
| position: fixed | g-p-f |
| font-size: 20px | g-fs-20 |
| color: #333 | g-c-#333 |
| cursor: not-allowed | g-c-na |
| background-color: red | g-bg-red | 注意`background-color`缩写与`border-color`同名，故`background-color`缩写为`bg` |
| border-color: red | g-bc-red |
| font-weight: 400 | g-fw-400 |
| display: flex | g-d-f |
| display: inline-flex | g-d-if |
| height: 20px | g-h-20 |
| width: 20px | g-w-20 |
| z-index: 2 | g-zi-2 |
| line-height: 20px | g-lh-20 |
| border-width: 2px | g-bw-2 |
| border-radius: 4px | g-br-4 |
| border-style: solid | g-bs-s |
| object-fit: cover | g-of-c |
| grid-gap: 10px | g-gg-10 |
| grid-row-gap: 10px | g-grg-10 |
| grid-column-gap: 10px | g-gcg-10 |
| align-items: flex-start | g-ai-fs |
| justify-content: center | g-jc-c |
| flex-direction: column | g-fd-c |
| flex-grow: 1 | g-fg-1 |
| top: 0 | g-t-0 |
| bottom: 0 | g-b-0 |
| left: 0 | g-l-0 |
| right: 0 | g-r-0 |
| overflow: hidden | g-o-h |
| overflow-x: hidden | g-ox-h |
| overflow-y: hidden | g-oy-h |
| opacity: 0.1 | g-o-0.1 |
| opacity: 1 | g-o-1 |
| order: 2| g-o-2 |
| text-align: center | g-ta-c |
