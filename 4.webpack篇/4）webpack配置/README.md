# webpack配置项

## entry

entry 是 webpack 开始打包的入口文件，从这个入口文件开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行。

如果在 output 选项里面没有配置 filename 选项名字的话，chunk 会被命名为 main，即生成 main.js

entry 也可以传入一个对象，并且 output 选项里面没有配置 filename 选项名字的话，则每个键(key)会是 chunk 的名称，该值描述了 chunk 的入口起点。.

```js
entry: {
	main: './src/index.js',
	sub: './src/index2.js',
},
```

dist就会输出main.js 和 sub.js

## output

output 的配置必须是一个`对象`，它指示 webpack 如何去输出、以及在哪里输出你的「bundle、asset 和其他你所打包或使用 webpack 载入的任何内容」。

输出配置只有这一个，即使有多个入口也是只有这一个。

```js
output: {
  filename: 'main.js', // 可以写成占位符的方式，打包的时候自动补充名称 [name].js
  path: path.resolve(__dirname, 'dist'), // 输出的文件夹路径
  publicPath: 'http://baidu.com' // 可选项，指定打包文件的公共前缀
}
```

filename的其他占位符：
![image](https://user-gold-cdn.xitu.io/2020/7/13/17347b81e6400bb4?w=690&h=210&f=jpeg&s=23203)

## Loader

配置Loaders可以让webpack支持更多的文件类型打包。

Loaders 本身是一个函数，接受源文件作为参数，返回转换的结果

在webpack中使用module属性来配置loader

其实loader 就是一个方案规则，他知道对于某一个特定的文件，webpack 该怎么去进行打包，因为本身，webpak 自己是不知道怎么去打包的，所以需要去使用 loader 来打包文件。

我们再举一个例子，可能有些朋友写过 vue，在 vue 中，文件是以 .vue 文件结尾的文件，webpack 是不认识 .vue 文件的，所以需要安装一个 打包 vue-loader 来帮助 webpack 打包 vue 文件。

- 例如加载图片

```js
    module: {
        rules: [
            { // 配置打包图片的loader
                test: /\.(png|jpg|gif|jpeg|svg)$/,
                use: {
                    loader: 'file-loader' // 这里用到了loader，所以要先下载它
                }
            }
        ]
    }
```

其实 file-loader 的底层原理其实就是，当它发现有图片文件的时候，它就帮图片文件自动打包移动到 dist 这个文件夹下，同时会给这个图片给一个名字，现在是一个一长串哈希值作为名字，然后它会讲这个图片名称作为一个返回值返回给我们引入模块的变量之中。

file-loader 不仅仅能打包图片文件，还能打包其他类型的文件，比如字体文件、txt、Excel 文件等，只要你想讲某个文件返回到某一个目录，并且返回这个文件名的时候，file-loader 都可以做到。

配置loader，只需要在module的rules数组中添加想要配置的loader

规则是：

    test 匹配相应的文件
    include 需要在这些文件里面去匹配
    exclude 不包含这些文件进行匹配
    use 使用对应的loader去打包，可以是对象，可以是数组。当时数组时，按从右到左的顺序进行loader打包

```js
module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'], // 需要依赖@babel/core 一起下载
                include: resolve('src')
            },
            {
                test: /\.less$/,
                // 将less编译成 css 再生成style文件
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            { // 配置打包图片的loader
                test: /\.(png|gif|jpe?g|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }
            }
        ]
    }
```

打包文件的loader除了file-loader还有 `url-loader`,url-loader实现了所有的file-loader的功能，但是url-loader会默认把文件打包引用改文件的文件里面。
比如html文件中引用了图片，图片会被打包成`base64`放到html文件中。

这样显然是有问题的，如果文件特别大就出现毛病了。

但是这个属性是可以配置的

```js
{ // 配置打包图片的loader
                test: /\.(png|gif|jpe?g|svg)$/,
                use: {
                    // loader: 'file-loader',
                    // options: {
                    //     name: '[name].[ext]',
                    // }
                    loader: 'url-loader',
                    options: {
                        name: '[name]_[hash].[ext]', 
                        limit: '10240', // 大于10KB的图片不会生成base64数据
                        outputPath: 'assets/' // 指定图片输出路径
                    }
                }
            }
```

- 样式loader

解析css的loader一般会用到 `css-loader style-loader`，将css文件打包，并且生成style标签引入css文件

如果用到了less 或者 scss 这种预编译语言，还需要，先将这些文件编译成css，这就用到了 `less-loader  sass-loader  node-sass`

如果需要给一些属性加上浏览器前缀，则可以用到`postcss-loader  autoprefixer`

postcss.config.js 用以配置postcss

```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```
同时，解析css的loder还需要加上postcss-loader

```js
{
    test: /\.less$/,
    // 将less编译成 css 再生成style标签，引入这个文件
    use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
},
```

- 数组中loader的执行顺序

一般来说，loader会按照数组逆序去执行，也就是说按照`postcss-loader -> less-loader -> css-loader -> style-loader` 这个顺序去执行

但是如果遇到less文件中引用了其他的less文件，它就有可能不走less-loader 和 postcss-loader了，而是直接从css-loader进行解析加载

为了避免css对其他模块产生影响，各个模块里的样式文件都只对自己的模块生效，这就叫做css的模块化

修改一下配置
```js
{
    test: /\.less$/,
    // 将less编译成 css 再生成style标签，引入这个文件
    use: [
        'style-loader',
        {
            loader: 'css-loader',
            options: {
                modules: true, // 启用css模块化
                importLoaders: 2 // 不管是js引入的 还是 less文件 引入的less文件 都需要走下面两个loader
            }
        },
        'less-loader',
        'postcss-loader'
    ]
},
```

## plugin

webpack之所以如此受欢迎，大部分源于各种各样的plugin。plugin主要用于扩展webpack的能力。

常用的plugin

1. clean-webpack-plugin

这个插件能帮我们在打包之前先删除掉打包出来的文件夹，防止文件冲突、重复等问题。

```js
plugins: [
	new CleanWebpackPlugin()
],
```

2. html-webpack-plugin

这个插件会帮助我们在 webpack 打包结束后，自动生成一个 html 文件，并把打包产生文件引入到这个 html 文件中去。

如果不对这个插件进行任何配置的话，他只能生成一个默认的`index.html`文件。如过我们希望定制化模版html的文件的话，则可以配置template属性。

在生产环境应该压缩html文件，所以还可以配置minify

```js
plugins: [
	new HtmlWebpackPlugin({
        template: 'public/index.html',
        minify: process.env.NODE_ENV == 'production'
	}),
],
```

3. 其他常用plugin
mini-css-extract-plugin：Webpack4.0 中将 css 从 bundle 文件中提取成一个独立的 css 文件；在 3.0 版本使用 extract-text-webpack-plugin。

terser-webpack-plugin：压缩 js 的插件，支持压缩 es6 代码，webpack4.0 默认使用的一个压缩插件，在 3.0 版本使用 uglifyjs-webpack-plugin 来压缩 js 代码。

copy-webpack-plugin：将文件或者文件夹拷贝到构建的输出目录

zip-webpack-plugin：将打包出的资源生成一个 zip 包

optimize-css-assets-webpack-plugin：压缩 css 代码的插件

webpack.DefinePlugin：创建一个在 编译 时可以配置的全局常量，比如设置 process.env.NODE_ENV，可以在 js 业务代码中使用。

webpack.DllPlugin：抽取第三方 js，使用 dll 打包。

## sourceMap

SourceMap 是一个映射关系。能够帮我们更好的定位源码的错误。

举个例子，现在我们发现打包出来的 dist 目录下的 main.js 的 97 行报错了，但因为他是打包后的文件，我们知道 main.js 第几行报错其实没有任何意义。这个时候 sourcemap 就出来帮我们解决了这个问题，因为他是打包文件和源码的一个映射关系，它知道 dist 目录下 main.js 文件的 97 行 实际上对应的 src 目录下的 index.js 文件的第一行，这样我们就能够快速定位问题，并进行修复了。

在webpack的配置中 `devtool` 属性可以用来配置此项。

来看看这个属性可以配置什么

![image](https://webpack-doc-20200329.now.sh/assets/img/sourcemap4.4134342d.png)

在生产环境中，一般我们不会配置该项，因为生产环境基本不需要知道源码哪里出错了。如果要配置的话，可以采用 `cheap-module-source-map`

而开发环境中，一般我们需要提示出来的错误比较全，打包速度比较快。所以可以用`cheap-module-eval-source-map`

## webpack-dev-derver

`webpack-dev-derver`他可以帮我们开启一个本地服务，它有很多的参数可供我们配置，比如项目启动的时候自动帮我们开启浏览器、指定端口起服务器等、自动帮我们刷新浏览器等

配置一下：
```js
 devServer: {
        contentBase: './dist', // 指定目录 起 服务器
        port: 8080, // 在 8080 端口起服务
    },
```
配合package.json的脚本，启动服务
```json
"scripts": {
    "build": "webpack --mode=production",
    "serve": "webpack-dev-server --open" // 启动服务后打开浏览器
  },
```

其余常用配置

1. proxy

开启代理，它的原理是使用 ``http-proxy-middleware``去把请求代理到一个外部的服务器，解决开发环境跨域问题

```js
devServer: {
        contentBase: './dist', // 指定目录 起 服务器
        port: 8080, // 在 8080 端口起服务
        proxy: {
            '/api': { // 代理所有api开头的请求
                target: 'http://your_api_server.com', // 代理到目标地址
                changeOrigin: true, // 改变请求的源地址 origin
                pathRewrite: {
                  '^/proxy': '' // 重写路径。匹配 /proxy ，然后变为'' 
                }
              }
        }
    },
```

2. publicPath

假设服务器运行在 http://localhost:8080 并且 output.filename 被设置为 bundle.js。

默认 publicPath 是 "/"，所以你的包(bundle)可以通过 http://localhost:8080/bundle.js 访问

可以修改 publicPath，将 bundle 放在一个目录：

```js
publicPath: "/assets/"
```

你的包现在可以通过 http://localhost:8080/assets/bundle.js 访问。

## HMR热更新

webpack提供的热更新模块在开发的时候非常 非常的舒服（大型项目热更新会变慢），它允许在运行时更新各种模块，而无需进行完全刷新。

用它很简单，在devServer中开启hot即可

```js
devServer: {
    hot: true
}
```

### 实现原理

![image](https://webpack-doc-20200329.now.sh/assets/img/hmr12.c0183428.png)

1. File System： 代表我们的文件系统，里面有我们的所有代码文件
2. Webpack Compile：Webpack 的编译器，将 JS 编译成 Bundle
3. HMR Server：将热更新的文件输出给 HMR Rumtime
4. Bundle server： 提供文件在浏览器器的访问
5. HMR Rumtime：客户端 HMR 的中枢，用来更新文件的变化，与 HMR server 通过 websocket 保持长链接，由此传输热更新的文件
6. bundle.js： 打包出來的文件

### 流程

分为两个流程，一个是文件系统的文件通过 `webpack 的编译器`进行编译，接着被放到` Bundle Server`服务器上，也就是 `1 -> 2 -> A -> B` 的流程；

第二个流程是，当文件系统发生`改变`的时候，Webpack 会重新编译，将`更新后的代码`发送给了 `HMR Server`，接着便通知给了 `HMR Runtime`，一般来说热更新的文件或者说是 module 是以 json 的形式传输给 `浏览器的 HMR Runtime` 的，最终 HMR Runtime 就会更新我们前端的代码。

webpack 编译

    1. webpack-dev-server 是将打包的代码放到 内存 之中，不是在 output 指定的目录之下，这样能使 webpack 速度更快。
    2. webpack-dev-server 底层是基于 webpack-dev-middleware 这个库的，他能调用 webpack 相关的 Api 对代码变化进行监控，并且告诉 webpack，将代码打包到内存中。
    3. Websocket 不会将更新好的代码直接发给服务器端，而是发一个更新模块的哈希值，真正处理这个 hash 的还是 webpack。
    4. 浏览器端 HMR.runtime 会根据最新的 hash 值，向服务器端拿到所有要更新的模块的 hash 值，接着再通过一个 jsonp 请求来获取这些 hash 对应的最新模块代码。
    5. 浏览器端拿到最新的更新代码后，如我们在配置文件中配置的一样，是根据 HotModuleReplacementPlugin 对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。
    6. 当模块的热替换过程中，如果替换模块失败，就会会推倒 live reload 操作，也就是进行 浏览器刷新 来获取最新打包代码