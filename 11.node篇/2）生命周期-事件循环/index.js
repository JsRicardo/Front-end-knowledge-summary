const fs = require('fs')
const { setImmediate } = require('timers')


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

