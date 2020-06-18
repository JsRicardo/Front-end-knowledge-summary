# 执行期上下文（闭包、立即执行函数）

### 1、js预编译

js引擎在执行js之前，会对js文件进行一次通篇的预编译，如果发现简单的错误（如语法错误），就不继续执行。

预编译之后开始执行js文件，在开始执行js的前一刻生成的全局的执行期上下文，GO（Global Object）全局对象，开始逐行解释执行js。

### 2、作用域、作用域链

函数是一个特殊的对象，函数对象，可以像这样调用函数的属性`fn.prototype`，还有一些不能访问的属性，比如`[[scope]]`——函数的域，就是函数的作用域，存储了执行期上下文的集合（作用域链）。

函数在执行的前一刻就会生成一个执行期上下文，也就是他的作用域。每一次执行生成的执行期上下文都是`全新的`，执行完毕即时销毁。

查询变量时，作用域链顶端往下找，找到即返回，找不到继续往下查找。

- 看看这段js被执行发生了什么
```js
function a() {
    function b() {
        var b = 234
    }
    var a = 123
    b()
}

var glob = 100
a()
```
首先，预编译，这个时候a被定义了，glob也被定义了。
```js
GO: {
    this: window,
    window: object,
    document: object,
    a: fn,
    glob: 100,
}
```
a被定义时，a也继承了GO，所以a的[[scop]]第0位变成了GO（作用域链顶端）
![image](https://wx1.sinaimg.cn/mw690/005QwFx4gy1gfwe6u7r53j30j507ogls.jpg)
下一步a被执行，这个时候a的[[scop]]发生了什么变化呢

    1. a执行前一刻产生了a的执行期上下文AO ，把AO放到作用域链顶端，GO向下移一位
    2. a执行，定义了b，b是一个函数，继承了a的作用域链
    3. a执行，定义了a
    4. b执行
![image](https://wx2.sinaimg.cn/mw690/005QwFx4gy1gfweixogyyj30ij09h3yx.jpg)
b被执行时：
    
    1. b被执行前一刻，产生了b的执行期上下文AO，把AO放到作用域链顶端，把继承自a的AO向下移一位
    2. b执行定义了b
![image](https://wx1.sinaimg.cn/mw690/005QwFx4gy1gfwevjrobxj30nd0ep751.jpg)

- 注意！

1. b指向的aAO和a指向的aAO是同一个内存地址
2. 函数执行完毕时，删除引用，也就是说b执行结束时，会删除掉bAO的`引用`，在图中就是把箭头删掉，而`不是删掉bAO`！！！b也只能删除bAO的引用，因为他自己生成的就只有bAO
3. 如果这些AO没人引用了，才会被垃圾回收
4. 这也就是为什么会有内存泄漏、闭包这些问题

### 3、闭包

但凡是内部的函数被保存到了外部，一定生成闭包。

MDN 对闭包的定义为：闭包是指那些能够访问自由变量的函数。 （其中自由变量，指在函数中使用的，但既不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）

在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。

```js
function a() {
    function b(){
        console.log(aaa)
    }
    var aaa = 333
    return b
}
var c = a()
c()
```
在上面的函数中，输出了`333`

    1. `var c = a()`这一行，a执行
    2. a执行产生了aaa被定义；b定义，继承了a的原型链，但是b并未执行
    3. a执行返回了被定义的b，并且赋值给了c
    4. a执行完，销毁自己的执行期上下文
    5. c执行，也就是b被执行

我们知道a执行完毕，删除了自己的执行期上下文，按理说aaa应该不存在了。但是b被保存到了外部，b的作用域链中还保存有被定义的aaa（这也解释了前面为什么不是销毁aAO，是删除aAO的引用），所以aaa被console了出来，这也就是闭包。

b被保存到了外部，导致了aAO一直有人引用，不能被垃圾回收机制回收，这也就导致了`内存泄漏`

- 下面函数输出什么
```js
function a () {
    var num = 100
    function b () {
        num++
        console.log(num)
    }
    return b
}

var c = a()
c() // 101
c() // 102
```
为什么是101 和 102 ？

因为被保存出来的b，引用着aAO，aAO中有num，两次c执行其实都是操作的aAO中的num（同一个内存地址），
第一次`num++ --> num = 101`，这个时候aAO中的num已经变成了101，所以第二次是102

- for循环为什么输出同一个数
```js
for (var i = 1; i < 10; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 0)
}
```
为甚么上面的函数会输出9个10？

    1. for循环结束时 i = 10
    2. for循环结束产生了9个setTimeout
    3. for循环是主线程任务，主线程任务执行完，才去执行setTimeout
    4. setTimeout里面没有i，去上一级作用域寻找i
    5. 此时i已经变成了10，所以输出9个10

如何改进？

1. 使用立即执行函数，每次接收到i，立即将i存到j中，setTimeout读取的都是j的值
```js
for (var i = 1; i < 10; i++) {
    (function (j){
        setTimeout(function timer() {
            console.log(j)
        }, 0)
    }(i))
}
```
2. let 

let和const，让JS拥有了块级作用域，用let后代码的作用域以块级为单位
```js
for (let i = 1; i < 10; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 0)
}
```

### 4、立即执行函数

函数被定义之后会占用内存空间，一直不会被释放，但是有一些函数不会重复调用，我们希望他执行一次就被销毁，不要占用空间。比如某些初始化的函数，这个时候就要用到立即执行函数了（执行完毕立即销毁）

```js
(function () { }()); // W3C建议使用方式
(function () { })();
```
立即执行函数不需要名字，即使有名字，也会被放弃