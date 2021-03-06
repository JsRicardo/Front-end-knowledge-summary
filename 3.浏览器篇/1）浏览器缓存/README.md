# 浏览器缓存

在性能优化中，缓存能够带来的优化是非常巨大的。那么缓存有些啥缓存呢？

- 强缓存
- 协商缓存

## 强缓存

首先，检查强缓存是不需要发送HTTP请求的。强缓存是通过请求里面的某个字段来检查的，这个字段分为两个阶段`HTTP/1.0`  `HTTP/1.1`

HTTP/1.0中使用`Expiers`， HTTP/1.1中使用的是`Cache-Control`

### Expiers

Expiers，过期时间，他是服务器返回体中的一个字段，由服务器设置这条信息的过期时间，告诉浏览器，在这个时间之前不需要再请求我，直接使用缓存即可。

```http
Expiers: Mon Jul 06 2020 16:06:36 GMT+0800
```
这个方式看起来挺不错的，但是聪明的人已经发现了问题，这个时间时服务器发给客户端的，客户端的时间可是千奇百怪，不一定准确的。所以个时间可能就不那么好用了。所以在HTTP/1.1里面这个字段就被放弃了，转而用了Cache-Control

### Cache-Control

Cache-Control和Expiers的不同就是：它采用的是这个资源的有效时间，而不是过期时间。这个字段叫做`max-age`

```http
Cache-Control: max-age=3600
```
也就是说，这个资源在3600秒之内可以使用缓存，也就是一小时内。

当然，他还有很多其他的字段，来处理不同的场景

- public
  
它代表，所有经过的代理服务器都可以缓存这个资源，因为一个大型的应用可能中间有很多层代理服务器，那么这里就是所有经过的代理服务器都可以去缓存这个资源，而不仅仅是浏览器。

- private

相应的，自然就有private，代表只有浏览器可以缓存，中间的代理服务器不能缓存

- no-cache

不缓存，也就是说直接进入下一步 找`协商缓存`

- no-store

强硬的不执行任何缓存

- s-maxage

代理服务器的缓存时间

如果说Expires和Cache-Control同时存在时，那么浏览器会优先考虑Cache-Control

当强缓存失效了，到时间了，那么这个时候，就应该去找下一个兄弟`协商缓存了`

## 协商缓存

当强缓存失效时，浏览器就会在请求头中添加 缓存标签 来访问服务器端，由服务器根据这个 标签 来决定是否使用缓存。这个就叫做`协商缓存`

有两个这样的标签：`ETag`、`Last-Modified`，这两个标签各有优劣

### ETag

ETag是服务器根据当前资源内容生成的唯一的标识，只要内部的内容有改动，这个值就会变动，服务器会把这个值在响应头中返回给浏览器。

浏览器接收到ETag的这个值后，会在下一次请求中吧这个值作为`IF-None-Match`这个字段的值，放在请求头中，发送给服务端。

服务器接收到IF-None-Match后，去和服务器资源的ETag值比较

- 如果两值相同，服务器就返回304，告诉浏览器，你使用缓存吧
- 如果不同，就说明需要要更新，不使用缓存了，直接进入正常的HTTP请求，返回新资源

### Last-Modified

Last-Modified意为，最后一次更新时间。在浏览器第一次请求时，服务器就返回这个字段。

浏览器接收到之后，再次发送请求时，就会在请求头的`If-Modefied-Since`字段中带上这个值

服务端拿到`If-Modefied-Since`字段的值，会和服务端中该资源的最后修改时间做对比

- 如果两值相同，服务器就返回304，告诉浏览器，你使用缓存吧
- 如果这个值小于服务端中资源的最后修改时间，那么久应该更新了，进入正常的HTTP请求，返回新的资源

### 对比

1. 在精准度上，ETag是对整个资源的内容进行标识，他比Last-Modified这种通过记录最后修改时间来对比要更加精准。

- 编辑了文件内容，但是文件内容并没有变更，这种情况可以使用缓存，但是Last-Modified不会使用缓存
- Last-Modified 能够感知的单位时间是秒，如果文件在 1 秒内改变了多次，那么这时候的 Last-Modified 并没有体现出修改了。

2. 在时间消耗上las-modified要更优秀些，因为它只记录修改时间，而etag需要去根据资源内容生成hash值

***如果两种方式都支持的话，服务器会优先考虑ETag***

## 缓存位置

前文说到，当返回状态码是304时，直接从缓存中取资源，那么缓存缓存在哪里呢？

四种浏览器缓存，按优先级从高到低划分：

    1. Service Worker
    2. Memory Cache
    3. Disk Cache
    4. Push Cache

Service Worker和 Web Worker很像，运行在主线程之外，脱离浏览器窗体。比如离线缓存就是用service worker cache。service worder 同样也是 PWA（Progressive Web App，下一代web应用）的重要实现机制

Memory Cache指的是内存缓存，从效率上讲它是最快的。但是从存活时间来讲又是最短的，当渲染进程结束后，内存缓存也就不存在了。

Disk Cache就是存储在磁盘中的缓存，从存取效率上讲是比内存缓存慢的，但是他的优势在于存储容量和存储时长。

如何选择内存缓存和硬盘缓存

    1. 比较大的JS、CSS文件会直接被丢进磁盘，反之丢进内存
    2. 内存使用率比较高的时候，文件优先进入磁盘

Puse Cache即推送缓存，这是浏览器缓存的最后一道防线。它是 HTTP/2 中的内容，虽然现在应用的并不广泛，但随着 HTTP/2 的推广，它的应用越来越广泛。

## 总结

对浏览器的缓存机制来做个简要的总结:

1. 首先通过 Cache-Control 验证强缓存是否可用
2. 如果强缓存可用，直接使用
3. 否则进入协商缓存，即发送 HTTP 请求，服务器通过请求头中的If-Modified-Since或者If-None-Match字段检查资源是否更新
4. 若资源更新，返回资源和200状态码
5. 否则，返回304，告诉浏览器直接从缓存获取资源