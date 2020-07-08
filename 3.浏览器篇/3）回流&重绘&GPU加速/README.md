# 说说浏览器回流（重排）、重绘以及GPU加速

首先，看看浏览器的渲染

GUI渲染引擎的渲染流程

![image](https://user-gold-cdn.xitu.io/2019/12/15/16f080ba7fa706eb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 回流

回流又叫重排，他基本会重走整个渲染流程。如果DOM结构发生改变，则重新渲染DOM树，然后将后面的流程(包括主线程之外的任务)全部走一遍。

![image](https://user-gold-cdn.xitu.io/2019/12/15/16f0809e65b3d2fc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

可以看到，整个过程开销是非常大的，它把解析和合成的整个过程全走了一遍

那么那些操作会触发回流呢？

1. DOM的几何属性发生了变化，例如`width、 height、 margin、 border...`
2. DOM节点发生了增减，或者位置发生了变化
3. 访问DOM的`offset系列`属性，`scroll系列`属性，`client系列`属性时，浏览器会为了获取这些属性，会进行回流操作
4. 调用`window.getComputedStyle`方法

## 重绘

重绘则是在元素的几何属性没有改变，其他某个或某些样式改变得时候会触发。比如元素的颜色变了之类的

重绘只会影响到样式节点 和 绘制节点，他不会对DOM树和图层树有影响

![image](https://user-gold-cdn.xitu.io/2019/12/15/16f080a26aa222d4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

聪明的你已经发现了，回流一定会发生重绘。

## GPU加速

GPU加速就是图层合成。比如CSS3的`transform、 opacity、 filter`这些属性，利用的就是合成，也就是GPU加速

为什么会GPU加速呢？

在合成的情况下，会直接跳过布局和绘制流程，直接进入`合成线程`，这么做的好处

- 能够充分发挥GPU的优势。合成线程生成位图的过程中会调用线程池，并在其中使用GPU进行加速生成，而GPU是擅长处理图数据的。
- 它不是在主线程处理的，不会影响主线程的处理速度，而且即便主线程卡主了，也不会受到影响

## 开发实践

1. 在开发中应避免直接使用style，而是添加class属性来控制样式修改
2. 可以使用`creatDocumentFragment`创建文档碎片，进行批量的DOM操作
3. 对于 `resize`、`scroll`等这种频繁操作的接口进行防抖/节流处理
4. 添加 will-change: tranform ，让渲染引擎为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。当然这个变化不限于tranform, 任何可以实现合成效果的 CSS 属性都能用will-change来声明