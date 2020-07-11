# 前端工程化

在模块化发展之后，前端也是继续着他的飞速发展之路，慢慢的前端的项目越来越大，越来越复杂，要管理的文件也越来越多。为了提高开发效率，体验，随之也出现了新的标准ES6，新框架VUE React Angular，css的预编译语言LESS/SASS，js的超集Typescript... 前端慢慢变得更加规范化，结构化，更加靠拢一个工程。

但是这些东西在浏览器端是无法直接运行的，所以又有了bundle，打包构建就出现了。


## 什么是项目构建
构建就是做这件事情，把源代码转换成发布到线上的可执行 javaScrip、CSS、HTML 代码

- 代码转换：编译项目中的 js、jsx、ts、sass、less
- 文件优化：压缩 js/css/html/img 等资源文件（减小文件的大小，减小内存占用）
- 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载
- 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件
- 自动刷新：热重载，监听本地源代码的变化，自动重新构建、刷新浏览器
- 代码校验：js 语法的检查
- 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统
- 构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。 构建给前端开发注入了更大的活力，解放了我们的生产力

## 代码构建工具

### Grunt

Grunt 是一个任务执行者

grunt 基本配置

```js
module.exports = function(grunt) {
  // 所有插件的配置信息
  grunt.initConfig({
    // uglify 插件的配置信息
    uglify: {
      app_task: {
        files: {
          'build/app.min.js': ['lib/index.js', 'lib/test.js']
        }
      }
    },
    // watch 插件的配置信息
    watch: {
      another: {
          files: ['lib/*.js'],
      }
    }
  });

  // 告诉 grunt 我们将使用这些插件
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 告诉grunt当我们在终端中启动 grunt 时需要执行哪些任务
  grunt.registerTask('dev', ['uglify','watch']);
};
```

### Gulp

Gulp 是一个基于`流`的自动化构建工具。 除了可以管理和执行任务，还支持监听文件、读写文件。Gulp 被设计得非常简单。

- 特点：

任务化

基于流（gulp 有一个自己的内存，通过指定 API 将源文件流到内存中，完成相应的操作后再通过相应的 API 流出去）

执行任务可以同步可以异步

API 

    通过 gulp.task 注册一个任务；
    通过 gulp.run 执行任务；
    通过 gulp.watch 监听文件变化；
    通过 gulp.src 读取文件；
    通过 gulp.dest 写文件。

### Rollup

Rollup 是一个和 Webpack 很类似但专注于 `ES6` 的模块打包工具

它使用 `tree-shaking` 的技术使打包的结果只包括实际用到的 exports。 使用它打包的代码，基本没有冗余的代码，减少了很多的代码体积

Vite在bundle的时候也是采用的Rollup，vue3在打包的时候甚至可以小到20+KB

但是 Rollup 的这些亮点随后就被 Webpack 模仿和实现，webpack也可以实现tree-shaking

和 webpack 之间的区别：

    Rollup 是在 Webpack 流行后出现的替代品；
    Rollup 生态链还不完善，体验不如 Webpack；

### webpack

webpack可以说是现目前前端工程化应用的最多的工具了。在 Webpack 里`一切文件皆模块`，通过 Loader 转换文件，通过 Plugin 注入钩子，最后输出由多个模块组合成的文件

![image](https://webpack-doc-20200329.now.sh/assets/img/build1.10d2db31.png)

JavaScript、CSS、SCSS、图片、模板等等一切的文件，在 Webpack 眼中都是一个个模块，这样的好处是能清晰的描述出各个模块之间的依赖关系，以方便 Webpack 对模块进行组合和打包。 经过 Webpack 的处理，最终会输出浏览器能使用的静态资源

Webpack 的优点是：

    1. 专注于处理模块化的项目，能做到开箱即用一步到位；
    2. 通过 Plugin 扩展，完整好用又不失灵活；
    3. 使用场景不仅限于 Web 开发；
    4. 社区庞大活跃，经常引入紧跟时代发展的新特性，能为大多数场景找到已有的开源扩展；
    良好的开发体验。
    5. 社区有各种插件用来扩展webpack的功能