const a = setInterval(() => {console.log('aa')}, 2000)
console.log(a)

console.log(__dirname)
console.log(__filename)

const buf = Buffer.from('asdadas', 'utf-8')
console.log(buf)

console.log('当前命令行执行路径：', process.cwd())

console.log(process.argv)

console.log(process.platform)

console.log(process.env)

console.log(module)
console.log(require)


const URL = require('url')

console.log(URL.URL('https://baidu.com'))

const util = require('util')

util.callbackfy("promiseObj")

util.promisefy("callbackFn")