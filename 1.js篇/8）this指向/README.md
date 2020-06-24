# 变更你的this指向

## call

- 定义

`call(thisArg, ...args)` 方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数。

如果调用apply的这个函数处于非严格模式下，则指定的thisArgs为 null 或 undefined 时会自动替换为指向全局对象，原始值会被包装。

- 基本使用

```js
var arr1 = [1, 2, 3]
console.log(Math.max.call(null, ...arr1))
```

- 实现bind

```js
Function.prototype.myCall = function (thisArg) {
    thisArg = thisArg || window;
    var args = []
    for (var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }
    thisArg.fn = this;

    var res = eval('thisArg.fn(' + args + ')');

    delete thisArg.fn
    return res;
}
```

## apply
- 定义
`apply(thisArgs, [argsArray])` 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。

call()方法的作用和 apply() 方法类似，区别就是call()方法接受的是参数列表，而apply()方法接受的是一个参数数组。

- 基本使用

```js
// 数组操作
var arr = [1]
var arr1 = [1, 2, 3]
[].push.apply(arr, arr1)

// 比较大小
var arr1 = [1, 2, 3]
Math.max.apply(null, arr1) // Math.max不能接受数组作为参数，没有扩展运算符的情况下可以这样使用
```

- 实现apply

```js
Function.prototype.myApply = function (thisArg, args) {
    thisArg = thisArg || window;
    thisArg.fn = this;
    var res = eval('thisArg.fn(...args)');

    delete thisArg.fn
    return res;
}
```


## bind
- 定义

`bind(thisArg, ...args)` 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

1. `thisArg` 调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用new运算符构造绑定函数，则忽略该值
2. 当使用 bind 在 setTimeout 中创建一个函数（作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 `object`
3. 如果 bind 函数的参数列表为空，或者thisArg是null或undefined，`执行作用域的 this` 将被视为新函数的 thisArg
4. `...args`会作为函数执行的参数传给原函数
5. bind返回的函数在执行时也可以传递参数，传递的参数排在`...args`后面

- 基本使用

```js
var x = 1
function show(a, b) {
    console.log(this) 
    console.log(this.x, a, b) // 全局变量中的x
}
show('a', 'b') // window 1 'a' 'b'
```
但是在某些业务场景中，我们这个show方法需要输出指定的某个对象里面的x，那么这个this就应该指向我们想要输出的对象

此时就可以用bind，返回一个新的函数去处理这么一个需求

```js
var obj = {
    x: 10
}

var newShow = show.bind(obj, 'a')

setTimeout(function(){
    newShow('c') // obj 10 'a' 'c'
}, 0) 
```

- 实现bind

```js
Function.prototype.myBind = function(){
    var _this = this
    var args = [].slice.call(arguments)
    var thisArg = args[0] // 传入的this指向
    args = args.slice(1) // 传入的函数执行时参数

    var TempFn = function () {}
    var fn = function () {
        // ...args会作为函数执行的参数传给原函数
        // bind返回的函数在执行时也可以传递参数，传递的参数排在...args后面
        var _args = [].slice.call(arguments)
        // 传入的thisArg是null或undefined，执行作用域的 this 将被视为新函数的 thisArg
        _this.apply(
            this instanceof _this ? this : thisArg, // new 的时候应该忽略传入的thisArg
            args.concat(_args)
        )
    }

    TempFn.prototype = this.prototype
    fn.prototype = new TempFn() // 使用TempFn 让外部new的时候可以顺着原型链找到show方法
    return fn
}
```