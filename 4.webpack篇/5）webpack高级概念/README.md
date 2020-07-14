# webpack高级概念

## Tree Shaking

tree shaking 主要服务与减少打包体积。它的作用是 能够在`模块`的层面上做到打包后的代码`只包含被引用并被执行的模块`，而不被引用或不被执行的模块被删除掉，以起到减包的效果。

在生产环境中，webpack会默认开启tree shaking，而开发环境中要启用tree shaking的话可以使用useExports来开启

```js
optimization: {
    usedExports: true,
},
```

### tree-shaking 的局限性

1. 只能是静态声明和引用的 ES6 模块，不能是动态引入和声明的

在打包阶段对冗余代码 (uglify) 进行删除，就需要 webpack 需要在`打包阶段`确定模块文件的内部结构，而 ES 模块的引用和输出必须出现在文件结构的第一级,写在文件的最前面 （'import' and 'export' may only appear at the top level），否则会报错。

而 CommonJS 模块是支持动态结构，它通过 require() 引入模块，所以是不能被 tree-shaking 进行处理的。

2. 只能处理模块级别，不能处理函数级别的冗余

因为 webpack 的 tree-shaking 是基于模块间的依赖关系，所以并不能对模块内部自身的无用代码进行删除。

3. 只能处理 JS 相关冗余代码，不能处理 CSS 冗余代码。

目前 webpack 只对 JS 文件的依赖进行了处理，CSS 的冗余并没有给出很好的工具。可以借助 `PureCss` 来完成这个目的。
