var op = new Promise((res, rej) => {
    setTimeout(() => {
        Math.random() * 100 > 60 ? res('及格') : rej('失败')
    }, 0)
})

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