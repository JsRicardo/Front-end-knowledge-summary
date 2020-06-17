# js如何实现继承

### 1、借助call

```js
function P() {
    this.name = 'parent';
}
function C() {
    P.call(this); // 传入this，获取到name
    this.type = 'child'
}
console.log(new C);
```
这样写的时候子类虽然能够拿到父类的属性值，但是问题是子类无法继承父类原型对象中存在方法

### 2、借助原型链

```js
function P2() {
    this.name = 'p2';
    this.play = [1, 2, 3]
}
function C2() {
    this.type = 'c2';
}
C2.prototype = new P2(); // 将属性放到C2的原型上，new C2的时候，新的实例可以访问到C2的原型上的name

console.log(new C2());
```
这种情况，如果有多个子类，那么他们操作的东西是同一个内存地址，也就是说子类不是全新的，会相互影响。

### 3、寄生组合继承

```js
function P3() {
    this.name = 'p3';
    this.play = [1, 2, 3];
}
function C3() {
    P3.call(this);
    this.type = 'c3';
}
C3.prototype = Object.create(P3.prototype); // 继承原型
C3.prototype.constructor = C3; // 指定构造函数
```

### 4、ES6的extends被编译后的JavaScript代码
```js
function _possibleConstructorReturn(self, call) {
    // ...
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}

function _inherits(subClass, superClass) {
    // ...
    //看到没有
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
// 验证是否是 Parent 构造出来的 this
function _classCallCheck(taget, superClass){}

var Parent = function Parent() {
    _classCallCheck(this, Parent);
};

var Child = (function (_Parent) {
    _inherits(Child, _Parent);

    function Child() {
        _classCallCheck(this, Child);

        return _possibleConstructorReturn(this, (Child.__proto__ || Object.getPrototypeOf(Child)).apply(this, arguments));
    }

    return Child;
}(Parent));
```

核心是_inherits函数，可以看到它采用的依然也是第三种方式————寄生组合继承方式，同时证明了这种方式的成功。不过这里加了一个Object.setPrototypeOf(subClass, superClass)，这是用来干啥的呢？

答案是用来继承父类的静态方法。这也是原来的继承方式疏忽掉的地方。

### 4、从设计思想上谈谈继承本身的问题

```js
class Car{
    drive(){
        console.log('i am driving')
    }
    addOil(){
        console.log('i am addOiling')
    }
}

class Bmw extends Car{
    
}
```
这个继承代码看起来很整洁，挺好的。但是有一个问题，万一这个车是新能源车，那么他就不需要加油的方法，而需要充电的方法。

如果让新能源汽车的类继承Car的话，是有问题的，俗称"大猩猩和香蕉"的问题。大猩猩手里有香蕉，但是我现在明明只需要香蕉，却拿到了一只大猩猩。也就是说加油这个方法，我现在是不需要的，但是由于继承的原因，也给到子类了。

    继承的最大问题在于：无法决定继承哪些属性，所有属性都得继承。

当然 也可以再创建一个父类，把加油的方法去掉，或者占位一个充能的方法，让子类去实现这个充能的方法。但是这也是有问题的，一方面父类是无法描述所有子类的细节情况的，为了不同的子类特性去增加不同的父类，代码势必会大量重复，另一方面一旦子类有所变动，父类也要进行相应的更新，代码的耦合性太高，维护性不好。