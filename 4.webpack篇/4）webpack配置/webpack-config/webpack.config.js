const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'main.js', // 可以写成占位符的方式，打包的时候自动补充名称 [name].js
        path: resolve('dist'), // 输出的文件夹路径
        publicPath: 'http://baidu.com' // 可选项，在引用这个文件的地方加上一个公共前缀
    },
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
                use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
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
    }
}
