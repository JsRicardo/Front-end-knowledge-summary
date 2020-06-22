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

多个promise并发，同时执行

所有promise都resolve时，返回值是一个成功数组

只要有一个reject，返回值就是被reject的值

### race

promise.race接收值和all是一样的，但是race是这些promise谁先执行完就返回

返回值是最先执行完的那个promise的结果

不管resolve还是reject

### promise原理实现

用ES5实现一个简易的promise构造函数

```js
/**
 * promise构造函数
 * @param {Function} excutor
 */
function MyPromise(excutor) {
    var _this = this

    _this.status = 'pending'
    _this.fulFilledValue = null // 存储成功的返回值
    _this.rejectedValue = null /// 存储失败的返回值
    _this.resolveEventList = [] // 存储注册的成功处理函数  为了多次绑定，链式调用
    _this.rejectEventList = [] // 失败的处理函数

    // promise状态不可逆 只能由pending变成 fulfilled 或者 rejected
    function resolve(value) {
        if (_this.status === 'pending') {
            _this.status = 'Fulfilled'
            _this.fulFilledValue = value
            // 执行注册是成功函数
            _this.resolveEventList.forEach(function (res) {
                res()
            })
        }
    }

    function reject(reson) {
        if (_this.status === 'pending') {
            _this.status = 'Rejected'
            _this.rejectedValue = reson
            // 执行注册的失败函数
            _this.rejectEventList.forEach(function (rej) {
                rej()
            })
        }
    }
    // promise可以直接抛出异常，用try catch接一下
    try {
        excutor(resolve, reject)
    }
    catch (e) {
        reject(e)
    }
}

// setTimeout模拟异步执行
// try catch捕获异常
function excuteFn(res, rej, fn, val) {
    setTimeout(function () {
        try {
            var newVal = fn(val)
            res(newVal)
        } catch (e) {
            rej(e)
        }
    }, 0)
}


MyPromise.prototype.then = function (onFulfilled, onRejected) {
    // 如果不注册处理函数的话，promise不处理返回的值，原样传递给下一个then
    // 如空then
    if (!onFulfilled) {
        onFulfilled = function (val) {
            return val
        }
    }
    if (!onRejected) {
        onRejected = function (reason) {
            throw new Error(reason)
        }
    }
    var _this = this
    // 为了链式调用，返回一个新的promise
    var newPromise = new MyPromise(function (res, rej) {
        if (_this.status === 'Fulfilled') {
            excuteFn(res, rej, onFulfilled, _this.fulFilledValue)
        }

        if (_this.status === 'Rejected') {
            excuteFn(res, rej, onRejected, _this.rejectedValue)
        }
        // 如果是异步任务，promise的状态还是pending，那么注册的成功 失败处理函数，
        // 不应该立即执行，而是应该在promise被reject或是被resolve再执行
        if (_this.status === 'pending') {
            _this.resolveEventList.push(function () {
                return excuteFn(res, rej, onFulfilled, _this.fulFilledValue)
            })
            _this.rejectEventList.push(function () {
                return excuteFn(res, rej, onRejected, _this.rejectedValue)
            })
        }
    })
    return newPromise
}



var op = new MyPromise((res, rej) => {
    setTimeout(() => {
        rej(0)
    }, 2000)
    //    throw new Error('你失败了')
})

op.then((val) => {
    console.log('触发了成功的函数: ' + val)
    return '我是成功'
},
(reason) => {
    console.log('触发了失败的函数：' + reason)
    throw new Error('asdasdas')
})
.then((val) => {
    console.log(val, '成功2')
}, (reason) => {
    console.log(reason, '失败2')
})
```
