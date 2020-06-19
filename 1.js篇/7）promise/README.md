# promise对象

### promise链式调用

链式调用时，中间写一个空then，不会对后面有影响，相当于不存在。
在promise链式调用中，返回普通值的情况
    
    1. 上一个then返回的值，会作为后一个then中的参数
    2. 如果上一个then没有抛出一个错误，那么后一个then只会执行成功的函数
    3. 如果抛出错误，那么后一个then就会触发失败的函数

```js
op.then((val) => {
    console.log('触发了成功的函数: ' + val)
    return '我是成功'
},
(reason) => {
    console.log('触发了失败的函数：' + reason)
    return '我是失败'
})
.then((val) => {
    console.log('触发了成功的函数2: ' + val)
},
(reason) => {
    console.log('触发了失败的函数2：' + reason)
})
// 不管前面的then是成功还是失败，后面只会输出 ’触发了成功的函数2‘
```

返回promise的情况：后面的then会根据前面的then返回的promise执行情况执行成功或者失败的函数。

    1. promise reject，后面的then执行失败的函数
    2. promise resolve，后面的then执行成功的函数

### catch finally

catch捕获异常，后面可以继续接then。如果catch的前面有then报错，并且前面的then没有注册失败的函数，就会进入catch里面。如果前面的then注册了失败的函数，就会进入失败的函数里面，catch接收不到错误。

finally结束链式调用，后面不能接then。

### all 

promise.all接收一个promise数组，可以将多个promise实例包装成一个新的promise实例

所有promise都resolve时，返回值是一个数组

只要有一个reject，就返回，返回值是被reject的值

### race

promise.race接收值和all是一样的，但是race是这些promise谁先执行完就返回

返回值是最先执行完的那个promise的结果

不管resolve还是reject

### promise原理实现