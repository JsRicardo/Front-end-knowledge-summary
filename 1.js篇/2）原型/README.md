# js原型原型链

- 所有的对象都是通过`new 函数`创建的
- Function是在js引擎启动的时候放在内存里面，不需要new
- `var obj = {}`本质上是通过`new Object`产生的
- 所有函数也是对象
  
### 1、原型 prototype

- 所有·函数·都有一个属性：prototype -> 函数原型
- 默认情况下，原型是一个普通的Object对象
- 默认情况下，原型有一个constructor，他也是一个对象指向构造函数本身

### 2、隐式原型 `__proto__`

- 所有对象都有一个隐式原型`__proto__`
- 当函数经过new调用时，这个函数就成为了构造函数，返回一个全新的实例对象，这个实例对象有一个__proto__属性，指向构造函数的原型对象(同一个内存空间)

```js
function test () {}
var a = new test()
console.log(a.__proto__ === test.prototype) // true
```

访问一个对象的属性时：

    1.看这个对象本身有没有这个属性，有则直接使用
    2.对象本身没有这个属性，看这个对象的隐式原型上有没有这个属性，有则直接使用
    3.还是没有的话，在原型链中依次查找

### 3、原型链
- 隐式原型构成的链式结构
- JavaScript对象通过__proto__ 指向父类对象，直到指向Object对象为止，这样就形成了一个原型指向的链条, 即原型链。
- 对象的 hasOwnProperty() 用来检查对象`自身`中是否含有该属性
- 使用 in 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true
![image](https://user-gold-cdn.xitu.io/2019/10/20/16de955ca89f6091?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

注意！

    1.Function的`__proto__`指向自身prototype
    2.Object的prototype的`__proto__`指向null

### 4、题解：
1. 下面函数输出什么
```js
var F = function(){}

Object.prototype.a = function(){}
Function.prototype.b = function(){}

var f = new F()

console.log(f.a, f.b, F.a, F.b) // fn undefined fn fn
```

为什么？

f被构造函数F构造出来，是一个对象，但是不是一个function