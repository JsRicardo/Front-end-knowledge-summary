# node事件循环

![image](https://user-gold-cdn.xitu.io/2020/7/24/1737fe6072145007?w=690&h=378&f=jpeg&s=28669)

node中的事件循环和浏览器中还是有比较大区别的

浏览器中只有两个事件队列，一个宏队列，一个微队列。而node中，事件循环的每一个部分都有一个队列。

只有当这个阶段队列里面的所有任务都执行完了之后，才会进下一个阶段，继续清空任务队列


## timers 队列

存放计时器的回调函数

## poll 轮询队列

这里存放 除了times checks 队列之外的几乎所有回调函数

比如：文件读取回调  监听请求的回调

## checks 队列

`setImmediate`的回调函数会直接进入checks队列

## 整个流程梳理

node首先执行全局的同步代码，遇到 timers 就放入计时线程进行计时，遇到 setImmediate 直接放入checks队列，其余的异步操作，一般放入poll队列

1. 一个事件循环进入到timers， 去计时线程将所有的timer拿出来计算一下，看看有没有到时间

   - 如果到时间了，就将回调拿出来执行，直到所有到时间的回调全部执行完毕，进入下一个队列
   - 如果时间没有到，就直接进入下一个队列

注意，这里，其实timers严格意义上不算是一个队列，它是从计时线程拿出timer计算看看有没有到时间，由于这个计算，这也是为什么timer计时不准的原因之一

2. 进入到poll队列
   
    - 如果没有这里没有任务需要执行，看看其他队列有没有需要执行的任务
        - 没有的话就在这个队列等待，直到其他队列有任务需要执行了，进入下一个队列
        - 如果其他队列一直没有任务需要执行，在poll队列等待足够长的时间，进入下一个队列
    - 如果这里有任务需要执行，清空这个任务队列。

3. 进入到check队列
    
    清空队列，在进入下一个阶段

```js
setTimeout(() => {
    console.log(1)
}, 0)

fs.readFile('./index.js', (err, data) => {
    console.log(2)
})

setImmediate(() => {
    console.log(3)
})

console.log(4)

// 4 1 3 2
```

    首先执行全局的同步代码，将timer放入计时线程， 将读取文件放入poll， 将setImmediate放入checks， 输出 4
    进入时间循环，正好timeout计时完毕，拿出来执行，输出 1 ，没有其他到时间的计时器，进入poll队列
    读取文件，需要一定时间，本来应该就是poll等待，结果发现checks有任务，进入checks
    进入checks 输出3
    进入下一次循环。。。 进过timer，到达poll，等待，文件读取完了，输出2，等待，发现没有其他任务了
    结束。

- 注意

setTimeout 0 和 setImmediate 的执行顺序 不一定会像前面分析的那样顺利，这主要还是取决于系统当时的环境，卡不卡，他们的执行顺序可能会变化

但是像这种情况又不一样了

```js
fs.readFile('./index.js', (err, data) => {
    setTimeout(() => {
        console.log(1)
    }, 0)
    setImmediate(() => {
        console.log(2)
    })
})
```
它会输出 2 1，无论计算机是不是卡顿，分析一下为什么呢

    1. 有读取文件的操作，进入事件循环
    2. 没有timers存在，进入poll
    3. 没有其他事件，在poll等待文件读取成功
    4. 读取文件成功后，执行回调，往timers丢入一个计时器，往checks丢入一个setImmediate
    5. 这时，其他队列有任务了，poll也清空了，进入下一个队列checks
    6. 所以肯定会先输出 2 


## NODE中的宏队列，微队列

在node中 nextTick 和 promise 队列 是不在事件循环中的 两个队列

如果要用宏队列和微队列来区分node中的事件处理顺序，那我们前面分析的所有的东西都是宏队列的，timers  checks  poll都是宏队列。而nextTick promise都是微队列的。

在node中，要进入下一步操作之前必须先清空微队列，而微队列中，nextTick的优先级又是最高的

来看一看这样一段程序

```js
setImmediate(() => {
    console.log(1)
})

Promise.resolve().then(() => {
    console.log(2)
    process.nextTick(() => {
        console.log(3)
    })
})

process.nextTick(() => {
    console.log(4)
    process.nextTick(() => {
        console.log(5)
    })
})

console.log(6)
```

它会是怎么样的一个输出顺序呢

    1. 程序按序执行，将setImmediate的回调放入checks
    2. 将nextTick的回调放入nextTick队列
    3. 将promise.then里面的回调放入promise队列
    4. 输出 6
    5. 要进入timers队列前，先清空微任务队列
    6. 先清空nextTick队列，输出 4 ，又在nextTick注册一个回调
    7. 清空nextTick队列，输出 5
    8. 清空promise队列，输出 2 ，往 nextTick队列中丢入一个回调
    9. 清空nextTick队列 输出 3
    10. 已经清空了微任务队列，进入timers，进入poll，进入checks
    11. 输出 1

所以整体的输出顺序应该是 6 4 5 2 3 1