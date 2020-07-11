
module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    assetsDir: './',
    devServer: {
        host: '0.0.0.0',
        port: 8082,
        compress: true, // 开启gzip压缩
    },
    // 去掉文件名中的 hash
    filenameHashing: false,
    css: {
        modules: false,
        extract: false,
        sourceMap: process.env.NODE_ENV === 'development',
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
            },
            postcss: {
                // 这里的选项会传递给 postcss-loader
            },
            sass: {
                // 设置css中引用文件的路径，引入通用使用的scss文件
                data: `
                    $baseUrl: "/";
                    @import '...';
                    `,
            },
        },
    },
    productionSourceMap: false, // 取消生产环境的sourcemap
    configureWebpack: config => {
        // cdn引入的资源需要注册一下
        config.externals = {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
        };
        // 警告 webpack 的性能提示
        config.performance = {
            hints: 'warning',
            // 入口起点的最大体积 整数类型（以字节为单位）
            maxEntrypointSize: 50000000,
            // 生成文件的最大体积 整数类型（以字节为单位 300k）
            maxAssetSize: 30000000,
            // 只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            },
        };
    },
};
