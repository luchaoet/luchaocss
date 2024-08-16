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
```html
<div class="g-m-10"></div>
```

### vscode扩展配合使用
安装扩展 luchaocss
