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


console.log(typeof null)

console.log(1 + '2')
console.log('1'.toString())

console.log(new String(1) + '2')

console.log(0.1 + 0.2 == 0.3)
console.log(Number.MAX_SAFE_INTEGER)
console.log(Number.MIN_SAFE_INTEGER)
console.log(9007199254740999n == 9007199254740998n)

console.log(BigInt(123456789))

const x = 10n
const y = 20n

console.log(x + y) // 30n

console.log(typeof x) // => 'bigint'

// console.log(x + 10)
// console.log(Math.max(10n, 20n))
console.log(0n == false)

// console.log(+10n)

console.log(typeof 1) // 'number'
console.log(typeof '1') // 'string'
console.log(typeof undefined)// 'undefined'
console.log(typeof true) // 'boolean'
console.log(typeof Symbol()) // 'symbol'
console.log(typeof []) // 'object'
console.log(typeof {}) // 'object'
console.log(typeof console.log) // 'function'

class Person {
    money = 'rich'
}
const p3 = new Person()
console.log(p3 instanceof Person)


class PrimitiveNumber {
    static [Symbol.hasInstance](x) {
        return typeof x === 'number'
    }
}
console.log(111 instanceof PrimitiveNumber)

function myInstanceof(left, right) {
    if (left == null || typeof left != 'object') return false

    let proto = Object.getPrototypeOf(left)

    while (true) {
        if (proto == null) return false

        if (proto == right.prototype) return true

        proto = Object.getPrototypeOf(proto)
    }
}

console.log(myInstanceof(p3, Person))


console.log(-0 === +0)
console.log(Object.is(-0 === +0), '--')

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
console.log(is(NaN, NaN))

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

var a = {
    value: 0,
    toString(){
        this.value++
        return this.value
    }
}

console.log(a == 1 && a == 2)