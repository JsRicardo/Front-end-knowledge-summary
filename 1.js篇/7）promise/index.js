/**
 * promise构造函数
 * @param {Function} excutor 
 */
function MyPromise(excutor) {
    var _this = this

    _this.status = 'pending'
    _this.fulFilledValue = null
    _this.rejectedValue = null
    _this.resolveEventList = []
    _this.rejectEventList = []

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