// function a() {
//     function b() {
//         var b = 234
//     }
//     var a = 123
//     b()
// }

// var glob = 100
// a()

// function a() {
//     function b(){
//         console.log(aaa)
//     }
//     var aaa = 333
//     return b
// }
// var c = a()
// c()

// function a () {
//     var num = 100
//     function b () {
//         num++
//         console.log(num)
//     }
//     return b
// }

// var c = a()
// c()
// c()

// (function () { }());
// (function () { })();

// for (var i = 1; i <= 10; i++) {
//     setTimeout(function timer() {
//         console.log(i)
//     }, 0)
// }

// for (var i = 1; i <= 10; i++) {
//     (function (j){
//         setTimeout(function timer() {
//             console.log(j)
//         }, 0)
//     }(i))
// }
// for (let i = 1; i <= 5; i++) {
//     setTimeout(function timer() {
//         console.log(i)
//     }, 0)
// }
for (var i = 1; i < 10; i++) {
    setTimeout(function timer() {
        console.log(i)
    }, 0)
}