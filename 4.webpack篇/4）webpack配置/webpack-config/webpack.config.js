const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'main.js', // 可以写成占位符的方式，打包的时候自动补充名称 [name].js
        path: resolve('./dist'), // 输出的文件夹路径
        // publicPath: 'http://baidu.com' // 可选项，在引用这个文件的地方加上一个公共前缀
    },
    devtool: process.env.NODE_ENV == 'development' ? 'cheap-module-eval-source-map' : 'none',
    devServer: {
        contentBase: './dist', // 指定目录 起 服务器
        port: 8080, // 在 8080 端口起服务
        hot: true, // 开启热更新
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
    plugins: [
        new CleanWebpackPlugin(),
        new miniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            minify: process.env.NODE_ENV == 'production', // 压缩html
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'], // 需要依赖@babel/core 一起下载
                include: resolve('src')
            },
            {
                test: /\.less$/,
                // 将less编译成 css 再生成style标签，引入这个文件
                use: [
                    // {
                    //     loader: 'style-loader',
                    //     options: {
                    //         insertAt: 'top', // 样式插入到 <head>
                    //         singleton: true, //将所有的style标签合并成一个
                    //       }
                    // },
                    {
                        loader: miniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                            hmr: process.env.NODE_ENV === 'development',
                        }
                    },
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
            {
                test: /\.scss$/,
                // 将scss编译成 css 再生成style标签，引入这个文件
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'sass-loader',
                    'postcss-loader'
                ]
            },
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
        ]
    },
}
