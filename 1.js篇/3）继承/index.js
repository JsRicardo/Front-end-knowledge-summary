function P() {
    this.name = 'parent';
}
function C() {
    P.call(this);
    this.type = 'child'
}
// console.log(new C);

function P2() {
    this.name = 'p2';
    this.play = [1, 2, 3]
}
function C2() {
    this.type = 'c2';
}
C2.prototype = new P2();

console.log(new C2());

function P3() {
    this.name = 'p3';
    this.play = [1, 2, 3];
}
function C3() {
    P3.call(this);
    this.type = 'c3';
}
C3.prototype = Object.create(P3.prototype);
C3.prototype.constructor = C3;

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