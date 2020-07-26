# 一面

1. https的具体实现原理是什么，是怎么实现安全传输的？

https是http协议的增强版，他在建立tcp链接的时候，还会建立一个tls链接，使得http和tcp/ip通信的时候并不会直接通信，而是会经过中间层加密 解密，中间会经过对称加密，和非对称加密

    1. 浏览器给服务器发送一个随机的加密字符 client_random, 和加密方法的列表
    2. 服务器收到这个随机加密字符， 返回一个 server_random 随机的加密字符，和一个选中的加密方法， 还有一个公钥、数字证书
    3. 浏览器生成另一个随机字符 pre_random，用收到的公钥加密，传输给服务器
    4. 服务器收到这个pre_random，用私钥解密

    5，现在他们拥有 client_random server_random pre_random 还有加密方法。然后用这个加密方法，混合三个随机字符，生成最终的 暗号

2. 如何实现js里的new的功能，一行代码描述；

new 操作符做的事情

    1. new 一个 函数时，生成一个新的对象
    2. 并且新的对象的 `this` 指向本身
    3. 新对象的原型指向构造函数的原型
    4. 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象

3. h5有没有用过，web worker是做什么的？

Web Worker (工作线程) 是 HTML5 中提出的概念，分为两种类型， `专用线程` （Dedicated Web Worker） 和 `共享线程` （Shared Web Worker）。专用线程仅能被创建它的脚本所使用（一个专用线程对应一个主线程），而共享线程能够在不同的脚本中使用（一个共享线程对应多个主线程

Web Worker 的意义在于可以将一些耗时的数据处理操作从主线程中剥离，使主线程更加专注于页面渲染和交互

需要注意的是

    有同源限制
    无法访问 DOM 节点
    运行在另一个上下文中，无法使用Window对象
    Web Worker 的运行不会影响主线程，但与主线程交互时仍受到主线程单线程的瓶颈制约。换言之，如果 Worker 线程频繁与主线程进行交互，主线程由于需要处理交互，仍有可能使页面发生阻塞
    共享线程可以被多个浏览上下文（Browsing context）调用，但所有这些浏览上下文必须同源（相同的协议，主机和端口号）

Worker 线程和主线程都通过 postMessage() 方法发送消息，通过 onmessage 事件接收消息。在这个过程中数据并不是被共享的，而是被复制的

可以在主线程中使用 terminate() 方法或在 Worker 线程中使用 close() 方法关闭 worker。这两种方法是等效的，但比较推荐的用法是使用 close()

4. 函数节流和函数防抖的原理，怎么实现？

函数防抖(debounce)：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时，**限制执行次数**

``` js
function debounce(fun, delay) {
    return function(args) {
        let _this = this
        let _args = args
        clearTimeout(fun.id)
        fun.id = setTimeout(function() {
            fun.call(_this, _args)
        }, delay)
    }
}
```

函数节流(throttle)：规定在一个**单位时间内，只能触发一次函数**。如果这个单位时间内触发多次函数，只有一次生效

``` js
function throttle(fun, delay) {
    let last, deferTimer
    return function(args) {
        let _this = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function() {
                last = now
                fun.apply(_this, _args)
            }, delay)
        } else {
            last = now
            fun.apply(_this, _args)
        }
    }
}
```

5. 怎么实现Promise的功能？

promise有三个状态 `pending Fulfilled Rejected`， 只能从pending变成 成功 或者 失败

new Promise 返回一个promise对象

promise resolve的返回值 会进入 then注册的成功处理函数  reject的返回值 会进入then注册的失败处理函数  或者catch

不管成功还是失败都会进入finally



6、webgl用过吗？

7、如何适应手机端页面？

8、css一系列问题

9. 闭包的优缺点是什么？

返回一个 函数， 必然形成闭包

变量长期驻扎在内存中；
避免全局变量的污染；
私有成员的存在；

闭包可以保存函数执行上下文的一些变量，使得外层的函数的变量被内层函数保留出去，达到缓存变量的目的

缺点：滥用闭包会导致内存泄漏

10、项目中怎么做图片压缩，减小打包后的项目大小？

 `image-webpack-loader`

``` js
{
    test: /\.(png|svg|jpg|gif)$/,
    use: [
        "file-loader",
        'image-webpack-loader',
    ]
}
```

11、webpack 和 gulp的对比，有用过这些吗？


1. js为什么要实现成单线程的，有什么好处

最终还是会操作dom，如果是多线程的，导致同时操作一个dom，这其实是不合理的。js引擎就是单线程的

2. TCP/IP有几层网络模型，都是做什么的？

tcp/ip主要分为`5层`，借鉴于OSI，把会话层，表示层，应用合并为应用层。每一层有每一层的协议，根据协议去封包，解包。我们前端常用的http就是在应用层协议。

![image](https://user-gold-cdn.xitu.io/2020/7/1/1730825720aa5ff0?w=690&h=387&f=jpeg&s=36251)


3、还是http和https的区别，https怎么实现它的安全性的？

4、http是无状态的协议，如何让他变成有状态的（我回答cookie 和 Session）

5、然后就继续问我cookie如和用之类的；

6、有做过h5开发吗？

7、web worker有什么用，什么样的场景比较适合？
