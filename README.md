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
