# js异步编程

无论是浏览器中还是node中的异步操作都无法避免一个点——回调机制

而回调机制有存在很多问题

    产生回调地狱，难以维护，可读性差，难以扩展
    try catch只能捕获同步代码中的异常
    同步并发的异步存在一些问题

### js异步编程有哪些方式

1. 回调函数

提到回调函数，很容易就想到，ajax函数，fs（node中），包括现在的微信小程序api也是使用的很多回调函数

在早期的jq中，$ajax就是采用的回调去处理的异步编程
```js
$ajax({
    data: '',
    sucess(){}
})
```
像node中读取文件，操作数据库，这些都是异步的
```js
fs.readFile(path, option, callback)
```
像这些回调函数，用得少，其实看起来还没有问题，但是遇到复杂的应用场景，可能就不尽如人意了，比如接口依赖，下一个接口需要依赖上一个接口返回的数据，就会不自觉的写出这种代码
```js
$ajax({
    data: '',
    sucess() {
        $ajax({
            data: '',
            sucess() {
                .....
            }
        })
    }
})
```
node中的操作也是一样的，我们会在开发中不知不觉就写出了`回调地狱`，这种代码无论是美观，可读性，可维护性都是非常差的。

2. promise

ES6中新增了promise对象，很好的解决了回调地狱的情况，还提供了错误处理的方式，jq也提供了类似的方式Deferred  then。

简单来讲，Promise类似一个盒子，里面保存着在未来某个时间点才会结束的事件。

    1. pending：进行中
    2. fulfilled：已经成功
    3. rejected：已经失败 状态改变，只能从 pending 变成 fulfilled 或者 rejected，状态不可逆。

```js
promiesObj.then((res) => do something....)
    .then((res) => do something....)
    .catch((err) => do something....)
    .finnaly(() => do something....)
```
promise提供了链式编程的方式，避免了大量的嵌套，方便了异步编程。但是当then过于太多的时候，代码看起来也会不太美观，不够优雅。

3. generator函数

generrator函数是协程在ES6中的实现，最大的特点就是可以暂停函数执行

协程：

    协程是一种用户态的轻量级线程，协程的调度完全由用户控制。协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈，直接操作栈则基本没有内核切换的开销，可以不加锁的访问全局变量，所以上下文的切换非常快。

利用协程完成 Generator 函数，用 co 库让代码依次执行完，同时以同步的方式书写，也让异步操作按顺序执行。
```js
co(function* () {
  const res1 = yield ajax1;
  const res2 = yield ajax2;
  const res3 = yield ajax3;
  const res4 = yield ajax4;
})
```
4. async await

async + await是ES7中新增的关键字（语法糖），我非常喜欢，用他们写出来的代码非常美观，优雅。可读性也非常的好。

凡是加上 async 的函数都默认返回一个 Promise 对象，async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里。

```js
const fn = async function () {
  const res1 = await ajax1;
  const res2 = await ajax2;
  const res3 = await ajax3;
  const res4 = await ajax4;
})
```