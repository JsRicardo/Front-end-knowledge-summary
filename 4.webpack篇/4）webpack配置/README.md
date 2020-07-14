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

