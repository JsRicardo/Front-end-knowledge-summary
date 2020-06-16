# js的数据类型

### 1、数据类型有哪些

7种原始数据类型：`number undefined string bigint boolean null symbol`

引用数据类型：对象`Object`，其中包含普通对象`Object`，数组对象`Array`，正则对象`RegExp`，函数对象`Function`，日期对象`Date`，数学对象`Math`

### 2、说出下面输出的结果
  
```js
// 操作引用值，输出是什么
function test(person) {
    person.age = 26

    person = {
        name: 'ricardo',
        age: 18
    }

    return person
}
const p1 = {
    name: 'fyq',
    age: 19
}

const p2 = test(p1)

console.log(p1) // { name: 'fyq', age: 26 }
console.log(p2) // { name: 'ricardo', age: 18 }
```
为什么？

因为js中引用对象的传值，都是传的对象在`堆内存中的地址`，也就是说test方法中接收的p1其实是p1在内存中的地址。`person.age = 26`这一行，其实是修改了p1内存地址中的age，所以输出P1时age是26。紧接着又给person赋值了另一个堆内存地址，并且返回，赋值给了p2，所以p2指向了`{ name: 'ricardo', age: 18 }`所在的内存地址


### 3、为什么typeof null 是 object，但是null却是原始数据类型？

`null`确实是`原始数据类型`，这其实是一个历史遗留问题，是一个js的BUG，可以理解为null在之前是给object的占位符。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然，而 null 表示为全零，所以将它错误的判断为 object 。

### 4、隐式类型转换

输出值问题：

```js
console.log(1 + '2') // '12'
'1'.toString()
```
为什么`'1'`有`toString`方法，并且调用还不会报错？

看看这条语句发生了什么
```js
let str = new Object('1')
str.toString()
str = null
```
第一步：创建一个Object的实例，（为什么不是String？因为目前ES6规范也不建议用new来创建基本类型的包装类。对Symbol和BigInt调用new都会报错）

第二步：调用实例上面的toString方法

第三步：立即销毁这个实例

整个过程体现了基本包装类型的性质，而`基本包装类型`恰恰属于`基本数据类型`，包括`Boolean`, `Number`和`String`。

### 5、0.1 + 0.2 != 0.3

为什么0.1 + 0.2 != 0.3？

因为0.1 + 0.2在计算机中相加，是转换为二进制去相加的，而0.2转换为二进制不等于0.2，而会无限循环，但是计算机有标准位数限制，所以会对这个无限循环的数进行截取，所以这里已经出现了精度缺失，再他们相加之后再转换为十进制数，自然也就不等于0.3，而等于0.30000000000000004，我们在判断时，可以计算他们的差值小于10的负9次方即可判断相等。

### 6、BigInt

- 什么是BigInt

BigInt是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们安全地对大整数执行算术操作，表示高分辨率的时间戳，使用大整数id，等等，而不需要使用库。

- 为什么需要BigInt

在js中，所有数字都是用双精度64位浮点格式表示，这样就会出现这么一些问题：
这导致JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的Number类型只能安全地表示`-9007199254740991`（-(2^53-1)）和`9007199254740991`（2^53-1），任何超出此范围的整数值都可能失去精度，可以使用`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`查看这两个数。

- 创建BigInt
  
创建BigInt只需要在数字末尾加上n即可
```js
9007199254740999n
```
或者使用用BigInt()构造函数
```js
BigInt(123456789)
```
- 使用

```js
const x = 10n
const y = 20n

console.log(x + y) // 30n

typeof x // => 'bigint'
```

- 注意！

1. BigInt不允许和Number混合使用，会报错

2. 不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。

3. 不可以像Number那样使用 + 将字符串转为数字
```js
console.log(10n + 10) //TypeError: Cannot mix BigInt and other types, use explicit conversions
console.log(10n, 20n) //TypeError: Cannot convert a BigInt value to a number
console.log(+10n) //TypeError: Cannot convert a BigInt value to a number
```
1. 当 Boolean 类型与 BigInt 类型相遇时，BigInt的处理方式与Number类似，只要不是0n，BigInt就被视为`true`

```js
console.log(0n == false) // true
```
4. 元素都为BigInt的数组可以进行sort。

5. BigInt可以正常地进行位运算，如|、&、<<、>>和^

- 兼容性

由于BigInt是一个新的数据类型，目前浏览器的兼容性还不是特别好，只有chrome67、firefox、Opera这些主流实现，要正式成为规范，其实还有很长的路要走。

可以在[can i use](https://www.caniuse.com/#search=BigInt)中查询

### 7、typeof类型检测

- typeof检测原始值类型

除了null其余的原始值类型都是正确的
```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
```
- typeof检测引用值类型

对于引用数据类型，除了函数之外，都会显示"object"。
```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

- instanceof

instanceof是基于原型链去查找，只要存在于原型链，就返回true

```js
class Person {
    money= 'rich' 
}
const p3 = new Person()
console.log(p3 instanceof Person) // true
```
既然instanceof是基于原型链查找，那原始数据类型如何使用instanceof检测属性
```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(111 instanceof PrimitiveNumber)
```

`Symbol.hasInstance`自定义instanceof行为的一种方式，这里将原有的instanceof方法重定义，换成了typeof，因此能够判断基本数据类型。

- 实现instanceof

instanceof的核心就是向原型链上方查找，找到了就返回true，找不到就返回false
```js
function myInstanceof(left, right){
    if (left == null || typeof left != 'object') return false
    //getProtypeOf是Object对象自带的一个方法，能够拿到参数的原型对象
    let proto = Object.getPrototypeOf(left)

    while(true){
        if (proto == null) return false

        if (proto == right.prototype) return true

        proto = Object.getPrototypeOf(proto)
    }
}

console.log(myInstanceof(p3, Person)) //true
```
### 8、Object.is 和 === 的区别

`-0 === +0`的输出是true，而`Object.is(-0 === +0)`输出的是false。Object.is在严格等于的基础上修复了一些bug，包括正负0，NaN，源码
```js

function is(x, y) {
    if (x === y) {
        //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    } else {
        //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
        //两个都是NaN的时候返回true
        return x !== x && y !== y;
    }
}
```

### 9、js中类型转换

js中的类型转换有三种：

    1.转换成数字
    2.转换成布尔值
    3.转换成字符串
规则：
![image](https://user-gold-cdn.xitu.io/2019/10/20/16de9512eaf1158a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 10、对象转原始类型的运行流程
对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：

     1.如果Symbol.toPrimitive()方法，优先调用再返回
     2.调用valueOf()，如果转换为原始类型，则返回
     3.调用toString()，如果转换为原始类型，则返回
     4.如果都没有返回原始类型，会报错
```js
var obj = {
    value: 3,
    valueOf() {
        return 4;
    },
    toString() {
        return '5'
    },
    [Symbol.toPrimitive]() {
        return 6
    }
}
console.log(obj + 1); // 输出7
```

### 11、[] == ![]

`[] == ![] => true`

== 中，左右两边都需要转换为数字然后进行比较。

[]转换为数字为0。

![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为true,

因此![]为false，进而在转换成数字，变为0。

0 == 0 ， 结果为true

### 12、使 a == 1 && a == 2 成立

如果a是一个基本数据类型，那这里肯定不能实现了，所以a必为引用值类型。根据引用值的转换规则，进行拦截操作。

```js
var a = {
    value: 0,
    valueOf(){
        this.value++
        return this.value
    }
}
```

### 13、== 和 ===的区别

相等？全等？ 其实并不合适，叫double equals 或者treble equals，或者叫不懂的人觉得比较不专业的双等或者三等操作符，是更加严谨和正确的叫法。

《Javascript高级程序设计》关于==和===的规则
    1.如果有一个操作数是布尔值，则在比较前先将其转换为数值，true转换为1，false转换为0，例如false == 0，true == 1

    2.如果一个操作数是字符串，另一个操作数是数值，先将字符串转换成数值，例如"1"==1,'' ==0

    3.如果一个操作数是对象，另一个操作数不是，则调用对象的valueOf()方法，用得到的基本类型按照前面的规则进行比较。

    4.null和undefined是相等的。

    5.如果有一个数是NaN，则相等操作符返回false，而不想等操作符返回true。NaN == NaN返回为false，因为规则如此。

    6.如果两个操作数是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回true，否则返回false。
    例如：var obj = {a:1};foo = obj;bar = obj;foo==bar;foo==bar返回为true，因为他们指向同一个对象，obj。
    
===和==的规则类似，唯一少了转换的一步。
