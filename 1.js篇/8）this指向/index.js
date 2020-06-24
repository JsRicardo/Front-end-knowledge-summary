
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
// Function.prototype.myApply = function (thisArg, args) {
//     thisArg = thisArg || window;
//     thisArg.fn = this;
//     var result = eval('thisArg.fn(...args)');

//     delete thisArg.fn
//     return result;
// }

var arr1 = [1, 2, 3]
console.log(Math.max.myCall(null, ...arr1))

// Function.prototype.myBind = function () {
//     var _this = this
//     var args = [].slice.call(arguments)
//     var thisArg = args[0] // 传入的this指向
//     args = args.slice(1) // 传入的函数执行时参数

//     var TempFn = function () { }
//     var fn = function () {
//         // ...args会作为函数执行的参数传给原函数
//         // bind返回的函数在执行时也可以传递参数，传递的参数排在...args后面
//         var _args = [].slice.call(arguments)
//         // 传入的thisArg是null或undefined，执行作用域的 this 将被视为新函数的 thisArg
//         _this.apply(
//             this instanceof _this ? this : thisArg, // new 的时候应该忽略传入的thisArg
//             args.concat(_args)
//         )
//     }

//     TempFn.prototype = this.prototype
//     fn.prototype = new TempFn() // 使用TempFn 让外部new的时候可以顺着原型链找到show方法
//     return fn
// }

// var x = 1

// function show(a, b) {
//     console.log(this)
//     console.log(this.x, a, b)
// }

// // show('a', 'b')

// var obj = {
//     x: 10
// }

// var newShow = show.myBind('a')

// setTimeout(function () {
//     newShow('c')
// }, 0)