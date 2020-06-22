const fn = function (resolve) {
    console.log(0)
    setTimeout(() => {
        console.log(1)
        resolve(2)
    },2000);
}

const p0 = new Promise(fn) // 同步任务进入主线程执行 new 的时候会执行fn  此时输出 0   在event table中注册setTimeout的内部函数

const p1 = Promise.resolve(p0) // 如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。 


console.log(p0 == p1) // 同步任务  进入主线程执行，在 0 之后输出 true  

// then微任务 优先执行权 先于setTimeout执行 注册了一个成功的处理函数
p1.then((v) => { // p1 fulfilled之后执行then注册的成功处理函数
    console.log(v, 'then')
})

async function haha(){
    let res = await 'aaa'
    console.log(res)
    if ('hha'){
        console.log('chengle')
    } else {
        // fuck
    }
}

haha()

console.log(haha)