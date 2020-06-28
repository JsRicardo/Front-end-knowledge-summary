console.log(111)

setTimeout(() => {
    console.log(222)
}, 0)

Promise.resolve().then(() => console.log(333))
console.log(444)


