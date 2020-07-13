const path = require('path')

module.exports = {
    entry: './index.js', // 打包的入口文件
    output: { // 打包好的文件放在哪个文件夹下
        filename: 'bundle.js',// 打包出来的文件的名字
        path: path.resolve(__dirname, 'dist') // 打包完放置文件的文件夹
    }
}