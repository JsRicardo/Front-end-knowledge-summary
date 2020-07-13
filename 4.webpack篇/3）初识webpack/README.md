# webpack究竟是什么

    官网的定义：webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。
    当 webpack 处理应用程序时，它会 递归地构建 一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，
    然后将所有这些模块打包成一个或多个 bundle。

简单来说，webpack就是一个打包工具。

```js
const os = require('os')
import 'aaa.js'
import 'abc.css'
import * as tool from 'bbb.js'
```

所有的这些东西，都是模块，不管是js img css...文件类型，还是 CommonJs、AMD、CMD的规范导入导出，都可以用webpack打包

# 实操webpack配置

首先新建一个test的项目，然后初始化一下

```cmd
mkdir webpack-test
cd webpack-test

npm init -y
```

这样就初始化好了一个项目，然后呢就需要暗转webpack脚手架了，这里是项目操作，就不全局安装了。

```cmd
cnpm i webpack webpack-cli -D
```
当webpack 打包文件的时候，我们需要告诉webpack 打包的`入口文件`、打包后需要放在哪个文件夹下、哪些文件不需要被打包到 js 中去，比如一些图片是不需要被打包到js 中，我们只需要引用这个图片的路径即可。这里我们便需要 wenpack的配置文件来做这些事情，告诉webpack到底该怎么打包。

webpack 的配置文件就是 webpack.config.js，我们在 Webpack-demo 文件夹下，新建一个 webpack.config.js 文件，对webpack进行打包的配置。

```js
const path = require('path')

module.exports = {
    entry: './index.js', // 打包的入口文件
    output: { // 打包好的文件放在哪个文件夹下
        filename: 'bundle.js',// 打包出来的文件的名字
        path: path.resolve(__dirname, 'dist') // 打包完放置文件的文件夹
    }
}
```
接着在package.json中配置一下打包指令

注意： 

- 指定打包的模式 `--mode`，否则webpack会报警告

- 生产环境的打包出来的文件是会被压缩的，如果不想被压缩，我们可以指定 mode 为 development

```json
"scripts": {
    "build": "webpack --mode='production'"
},
```
这时，一个超级简陋的webpack打包项目就建立成功了。但是这明显是不够用在真实项目中的，所以还需要更多的配置，和plugin来做支撑。
常用的webpack配置项大概有：

    Entry：配置模块入口
    Output：配置如何输出最终想要的代码
    Module：配置处理模块的规则
    Resolve：配置寻找模块的规则
    Plugins：配置扩展插件
    DevServer：配置DevServer，就是起一个服务
    其他配置项：其他零散的配置项
    整体配置结构：整体的描述各配置项的结构
    多种配置类型：配置文件不不止可以返回一个 Object，还可以返回其他格式
    