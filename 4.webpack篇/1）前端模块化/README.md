# 模块化

- 模块化是指将一个复杂的系统分解为多个模块以方便编码。

因为之前写代码，开发网页的时候需要通过命名空间来组织代码，比如 JQuery 会将它的所有 Api 都挂在 window.$ 下，在加载完 JQuery 之后，其他模块 再通过 window.$ 去使用 JQuery。这样便会出现很多问题：

    1. 命名空间产生冲突，两个库可能会使用同一个名称
    2. 无法合理的管理项目的依赖和版本
    3. 无法方便的控制依赖的加载顺序
    4. 当项目变得越来越大的时候，这种方式会变得难以维护，所以在这里需要用模块化的思想来组织代码。目前流行的 前端模块化规范有 CommonJs、AMD、CMD、ES6

## CommonJS

CommonJs 是一种被广泛使用的 JavaScript 模块化规范，其核心思想是通过 `require` 方法来同步加载依赖的其他模块，通过 `module.exports` 导出需要暴露的接口。 Node.js 就是采用了这种方式

```js
// 导出文件 aaa.js
function abc () {
    //ddd
}
module.exports = {
    abc: abc
}
// ------------------------
// 导入文件 bbb.js
const { abc } = require('./aaa.js')
const fs = require('fs') // 不带路径引用
const os = require('os')
```
- 特点

commonJS用`同步`的方式加载模块，在服务端，模块文件都存在本地磁盘，读取很快，但在浏览器端因为网络等原因，最好的方式应该需要进行异步加载；因为是同步加载，所以只有加载完成，才能执行后面的操作；在服务器端，模块的加载是运行时直接可以运行的；在浏览器端，模块需要提前编译打包处理

因为是同步导入的，所以你可以这样使用

```js
function abc () {
    // do someting
    require('bbb.js')() // 不用再文件开头引入，直接在需要的时候再引入
}
```

CommonJS 模块的加载，输入的是被输出的值的`拷贝`。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值

## AMD

AMD 也是一种 JavaScript 模块化规范，与 CommonJS 最大的不同在于，他采用了`异步`的方式去加载依赖的模块。它主要解决针对浏览器环境的模块化问题，因为浏览器环境有可能会因为网络的原因，需要从服务器加载数据，那么这里就需要采用非同步的模式。最具代表性的实现是 `require.js`

采用 AMD 导入及导出的代码如下（使用require.js）：

```js
// 定义没有依赖的模块
define(function(){
  return `模块`
})

// 定义有依赖的模块
define(['module1', 'module2'], function(m1, m2){
  return '模块'
})

// 引入使用模块
require(['module1', 'module2'], function(m1, m2){
  // 使用m1、m2
})
```
- 特点

可以直接在浏览器中运行，可以异步加载依赖，并可以同时加载多个依赖，避免页面失去响应；定义模块的方法很清晰，不会污染全局环境，能够清晰的显示依赖关系。但是Javascript 运行环境没有原生支持 AMD，需要先导入实现了 AMD 的库后才能正常使用

## CMD

CMD规范专门用于浏览器端，模块的加载是`异步`的，模块使用时才会加载执行。它整合了 CommonJS和AMD规范的特点最具代表性的是 `Sea.js`

采用 CMD 导入及导出的代码如下：

```js
//定义没有依赖的模块
define(function(require, exports, module){
  exports.xxx = value
  module.exports = value
})

//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
  require.async('./module3', function (m3) {
  })
  //暴露模块
  exports.xxx = value
})

// 引入使用模块：
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```

## ESModule

ES模块化是在ES6出现的，是国际标准化组织 ECMA 提出的 JavaScript 模块化 规范，它在语言层面上实现了模块化。浏览器厂商和 Node.js 都说要原生支持该规范。他将取代 CommonJs 和 Amd 规范，成为浏览器和服务器通用的模块解决方案。目前主流浏览器新版都已原生支持ESModule，Vite等bundleless的开发工具就是采用的ESModule方案

```js
// 导入
import { readFile } from 'fs'
import Vue from 'vue'

// 导出
export default function () {}
export const __VALUE = 10
```

## ES6 与 CommonJs的差异

- CommonJS 模块输出的是一个值的`拷贝`，ES6 模块输出的是值的`引用`。

CommonJs 在上文中已经进行分析过，ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令 import，就会生成一个`只读引用`。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。因此，ES6 模块是`动态引用`，并且不会缓存值，模块里面的变量绑定其所在的模块

- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在`脚本运行`完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码`静态解析`阶段就会生成