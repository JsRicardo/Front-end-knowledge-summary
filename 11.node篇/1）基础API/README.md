# node核心

## 全局对象 global

- setTimeout
- setInterval

和浏览器不一样，node环境中，他们返回的是一个`对象`，而不是一个数字

- setImmediate
- console


- __dirname

获取当前模块所在的目录，但是它不是`global`的属性

- __filename

获取当前文件的路径，但是它不是`global`的属性

- Buffer

类型化数组

继承自`UInt8Array`

- process

node 进程的相关信息

cwd()

    获取运行命令行的文件路径

exit()

    强制退出node进程，接收一个可选参数，表示是否正常退出

argv

    一个数组，获取执行命令行时所携带的参数 如 `--open`

platform

    获取当前的操作系统平台

kill(pid)

    根据ID杀死一个进程，每次启动程序，操作系统会自动分配进程ID

env

    获取系统环境变量

## node模块化 commonJs

### 模块查找

绝对路径

相对路径（会自动转换为绝对路径）

    首先检查是否是内置模块，如fs、path
    检查当前目录中的node_modules
    检查上级目录中的node_modules
    转换成绝对路径
    加载模块
    找不到就报错

### module对象

### require函数

## 基本内置模块

### os

os.arch() 获取cpu的架构名  x86 x64

os.cpus() 获取内核数组

os.freemem() 获取内存剩余，是字节

os.homedir() 获取用户文件夹路径

os.tmpdir() 获取操作系统的临时目录

### path

    filename  d:\xxxx\xxxx\index.html
    basename  index
    dirname   xxxx\xxxx
    extname   html
    join      多段路径拼接成一个路径
    resolve   转换为绝对路径

### URL

URL.URL    将一个地址解析成对象
URL.parse  同理

## IO

IO速度往往低于CPU和内存的速度

跟除了CPU和内存的 input  output 都叫做 IO

### 文件IO

    readFile     读文件
    writeFile    写文件
    copyFile     复制文件
    stat         文件|夹的信息
    mkdir        创建目录
    readdir      读取文件夹下的所有文件|夹
    exists       文件是否存在