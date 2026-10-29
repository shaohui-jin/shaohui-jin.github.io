---
headerDepth: 3
---

### node的模块查找策略

> **`./`** 或 **`../`** 作为前缀 -> `文件查找` -> `文件夹查找`
>
> 其他情况 -> `内置模块查找` -> `第三方模块查找`

```javascript
/***
 * 1.文件查找
 *  1.1 ./a.js
 *  1.2 ./a.json
 * 2.文件夹查找
 *  2.1 ./a/package.json main字段
 *  2.2 ./a/index.js
 *  2.3 ./a/index.json
 */
require('./a')

/***
 * 1. 内置模块查找
 * 2. 第三方模块查找(node_modules中存在时，回到文件查找、文件夹查找)
 *  2.1 ./node_modules/a
 *  2.2 ../node_modules/a
 *  2.3 ../../node_modules/a
 *  2.4 ../../../node_modules/a
 *  2.5 ../../../../
 */
require('a')
```
