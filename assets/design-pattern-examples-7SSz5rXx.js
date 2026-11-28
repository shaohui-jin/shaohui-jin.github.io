const n=`---
title: 示例
date: 2024-05-18 18:54:31
category:
  - JavaScript
---

### 单例模式

> \`Proxy\`: Proxy 代理可以使得操作 **singleton返回的对象** 的原型时，能挂载到原型上

\`\`\`js {3-10,14}
function singleton(className) {
  let ins;
  return new Proxy(className, {
    construct(target, args) {
      if (!ins) {
        ins = new target(...args);
      }
      return ins;
    },
  });
}

class Cat {}
const NewCat = singleton(Cat);

const catA = new NewCat();
const catB = new NewCat();
console.log(catA, catB, catA === catB); // Cat {} Cat {} true
\`\`\`
`;export{n as default};
