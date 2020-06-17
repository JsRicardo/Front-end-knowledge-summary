var obj = {}

function test () {

}

var a = new test()

console.log(test.prototype)

console.log(a.__proto__)
console.log(a.__proto__ === test.prototype) // true

// 获取a的构造函数名称
console.log(a.__proto__.constructor.name)

var F = function(){}

Object.prototype.a = function(){}
Function.prototype.b = function(){}

var f = new F()

console.log(f.a, f.b, F.a, F.b) // fn undefined fn fn