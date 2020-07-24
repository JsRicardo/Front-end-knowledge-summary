const fs = require('fs')
const path = require('path')

const filepath = path.resolve(__dirname, './files/1.txt')
const dirpath = path.resolve(__dirname, './files')


// fs.readFile(filepath, 'utf-8', (err, data) => {
//     console.log(data)
// })

// fs.writeFile(
//     filepath,
//     'asfaf发斯蒂芬斯蒂芬',
//     {
//         flag: 'a' // 追加内容
//     },
//     (err) => console.log(err)
//  )

// fs.readFile(filepath, 'utf-8', (err, data) => {
//     console.log(data)
// })

// fs.copyFile(filepath, path.resolve(__dirname, './files/2.txt'), (err) => console.log(err))

// fs.stat(filepath, (err, stats) => {
//     console.log(stats)
// })

// fs.readdir(dirpath, (err, files) => {
//     console.log(files) // 文件数组
// })

fs.exists(filepath, (exist) => {
    console.log(exist)
})