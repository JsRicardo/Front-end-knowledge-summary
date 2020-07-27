const fs = require('fs')
const { setImmediate } = require('timers')


// setTimeout(() => {
//     console.log(1)
// }, 0)

// fs.readFile('./index.js', (err, data) => {
//     setTimeout(() => {
//         console.log(1)
//     }, 0)
//     setImmediate(() => {
//         console.log(2)
//     })
// })

// setImmediate(() => {
//     console.log(3)
// })

// console.log(4)

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

const { EventEmitter } = require('events')

const EE = new EventEmitter

const fn = () => {
    console.log('add')
}

EE.on('add', fn)

EE.once('once', () => {
    console.log('once')
})

EE.off(fn, 'add')