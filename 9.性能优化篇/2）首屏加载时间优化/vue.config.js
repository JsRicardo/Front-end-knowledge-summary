var os = require('os');
const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

function resolve (dir) {
    return path.join(__dirname, dir);
}
var networkInterfaces = os.networkInterfaces();

process.env.VUE_APP_VERSION = JSON.stringify(networkInterfaces);
function getDateTime () {
    var d, s;
    d = new Date();
    s = d.getFullYear(); // 取年份
    s += '' + ('0' + (d.getMonth() + 1)).substr(-2);// 取月份
    s += '' + ('0' + d.getDate()).substr(-2); // 取日期
    s += '' + ('0' + d.getHours()).substr(-2); // 取小时
    s += '' + ('0' + d.getMinutes()).substr(-2); // 取分
    return s;
}

process.env.VUE_APP_BUILD_TIME = getDateTime();
process.env.VUE_APP_VERSION = require('./package.json').version + '_' + getDateTime();
// 全局domain
process.env.VUE_APP_BASE_DOMAIN = process.env.NODE_ENV === 'development' ? '' : '../';

module.exports = {
    // 基本路径
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    // 打包输出路径
    outputDir: '/dist',
    pages: {
        // 开发时 
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
            title: '',
        },
        // production
        android: {
            entry: 'src/main.js',
            template: 'public/index-android.html',
            filename: 'index-android.html',
            title: '',
        },
    },
    // 去掉文件名中的 hash
    // filenameHashing: false,
    css: {
        modules: false,
        sourceMap: process.env.NODE_ENV === 'development',
        extract: process.env.NODE_ENV === 'development' ? false : {
            // 为css添加版本号
            filename: `css/[name].${process.env.VUE_APP_VERSION}.css`,
            chunkFilename: `css/[name].${process.env.VUE_APP_VERSION}.css`,
        },
        loaderOptions: {
            css: {
                // 这里的选项会传递给 css-loader
            },
            postcss: {
                // 这里的选项会传递给 postcss-loader
                plugins: [
                    // 设置移动端适配
                    require('postcss-px-to-viewport')({
                        'unitToConvert': 'px',
                        'viewportWidth': 1024,
                        'viewportHeight': 768,
                        'unitPrecision': 5,
                        'viewportUnit': 'vw',
                        'selectorBlackList': [
                            'px-',
                        ],
                        'minPixelValue': 1,
                        'mediaQuery': false,
                    }),
                ],
            },
            sass: {
                // 设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
                data: `
                    $baseUrl: "/";
                    @import '@/style/theme.scss';
                    @import '@/style/var.scss';
                    `,
            },
        },
    },
    productionSourceMap: process.env.NODE_ENV === 'development',
    chainWebpack: config => {
        // 为图片添加版本号
        config.module
            .rule('images')
            .use('url-loader')
            .tap(options => {
                return {
                    limit: 10000,
                    fallback: {
                        loader: 'file-loader',
                        options: {
                            name: `img/[name].${process.env.VUE_APP_VERSION}.[ext]`,
                        },
                    },
                };
            });
        config.module
            .rule('fonts')
            .test(/\.(woff2?|ttf)(\?.*)?$/)
            .use('url-loader')
            .loader('url-loader')
            .options({
                limit: 10000,
            });
        // 添加自定义路径
        config.resolve.alias
            .set('$public', resolve('public'))
            .set('$dist', resolve('dist'))
            .set('$style', resolve('src/style'))
            .set('$common', resolve('src/common'))
            .set('@', resolve('src'));

        // 为js添加版本号
        config.output.chunkFilename(`js/[name].${process.env.VUE_APP_VERSION}.js`);
        config.output.filename(`js/[name].${process.env.VUE_APP_VERSION}.js`);
    },
    configureWebpack: config => {
        // 处理cdn依赖文件
        config.externals = {
            'vue': 'Vue',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'cordova': 'cordova',
        };

        const plugins = [];

        // 生成 gzip 压缩文件
        plugins.push(
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: productionGzipExtensions,
                threshold: 10240,
                minRatio: 0.8,
                deleteOriginalAssets: false,
            })
        );
        config.plugins = [...config.plugins, ...plugins];
    },
};
