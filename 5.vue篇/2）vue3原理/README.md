# vue3原理 - mini-vue3

## 挂载dom

首先，还是从挂载一个dom元素开始

vue3中我们可以利用暴露出来的 `h` 函数来渲染一个模版，他接收的参数就是一个用js表示的dom结构 `tag标签，属性，孩子节点`
假设我们有一个用js构建的vdom的模版，长这样

``` js
const vdom = h('div', {
    class: 'red'
}, [
    h('span', null, 'hello')
])
```

那么接下来我们就该解析这个结构，用以把他挂载到真实的dom结构上

假设我们已经实现了一个mount方法，那么我们就只需要调用mount方法完成挂载

``` js
// 传入要挂载的虚拟dom，和父节点
mount(vdom, document.getElementById('app'))
```

如此mount方法需要解决的就是

* 解析vdom
* 解析props（假设这里只有attr，没有props，一些其他自定义属性）
* 解析children子节点

``` js
// 挂载元素
function mount(vNode, container) {
    const elm = document.createElement(vNode.tag)

    // props
    if (vNode.props) {
        for (const key in vNode.props) {
            const attr = vNode.props[key]
            if (key.startsWith('on')) {
                // 事件监听
                const type = key.substr(2).toLocaleLowerCase()
                elm.addEventListener(type, attr)
            } else {
                elm.setAttribute(key, attr)
            }
        }
    }
    // children
    if (vNode.children) {
        if (typeof vNode.children === 'string') {
            elm.textContent = vNode.children
        } else {
            // 递归解析子元素
            vNode.children.forEach(child => {
                mount(child, elm)
            })
        }
    }
    container.appendChild(elm)
}
```

OK，这样我们就完成了一个非常简单的dom挂载过程。

## 更新dom

dom挂载了之后，我们还可能触发一些操作来更新dom，比如点击按钮改变颜色，数字++这种操作，这个时候我们不需要去操作真实的dom，只需要根据新的dom，对旧的dom打补丁

假设我们已经实现了这样一个patch函数，他可以对旧元素打补丁。

``` js
const vdom2 = h('div', {
    class: 'red'
}, [
    h('span', null, 'hello')
])
patch(vdom, vdom2)
```

这里需要对比新旧的vdom，所以我们对mount改造一下，存储一下真实dom结构，方便后面操作。

``` js
const elm = vNode.elm = document.createElement(vNode.tag)
```

这要就可以通过vdom.elm访问真实的dom结构

接下来考虑一下，patch需要做什么？

比较两个节点是不是同一种节点，如果是的话继续比较属性和子节点。

如果不是的话，就需要进行节点的替换，节点的替换也是很复杂的处理，这里不讨论。

1. 比较新旧两个props

这里需要注意的是，会出现很多分支情况，新旧节点的props可能都不存在，都存在，或者新的存在，或者旧的存在。然后每一个props可能出现变化，或者未变化。

同样的，这里只讨论attribute的情况，并且只讨论都有props的情况。在vue里面处理这个情况是很复杂的，这里只探讨 `补丁` 的思路

``` js
const oldProps = n1.props || {}
const newProps = n2.props || {}

// 如果这个属性存在 或者新增
for (const key in newProps) {
    const oldValue = oldProps[key]
    const newValue = newProps[key]
    // 新增了属性 或者  两个属性的值 不相等，需要变更节点内容了
    if (oldValue !== newValue) {
        elm.setAttribute(key, newValue)
    }
}
// 删除了属性
for (const key in oldProps) {
    if (!(key in newProps)) {
        // 删除了一个属性
        elm.removeAttribute(key)
    }
}
```

2. 比较新旧两个children

同样的，children的比较也会遇到相同的问题，会有很多分支情况需要去考虑。

而且最复杂的其实是两个children都是数组的时候，vue里面会要求显示的设定key值，以减轻 `diff` 算法的压力，这个模式叫做 `key模式`
这里就假设没有key值，并且简单粗暴的比较两个children的每个节点。

``` js
// 比较children
const oldChildren = n1.children
const newChildren = n2.children
if (typeof newChildren === 'string') {
    if (typeof oldChildren === 'string') {
        // 两个节点都是字符节点，内不同时，修改内容
    } else {
        // 新节是字符 旧节点是 数组 直接替换
    }
} else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === 'string') {
        // 旧节点只是字符 新节点是数组 挂载新节点
    } else if (Array.isArray(oldChildren)) {
        // 如果两个节点都是数组  这里vue中用到key的模式去判断是不是同一个元素
        // 假设没有key  我们只比较两个数组的 index 相同的部分
        const commonLength = Math.min(newChildren.length, oldChildren.length)
        for (let i = 0; i < commonLength; i++) {
            // 比较一下 公共部分的 每一个child
        }
        // 接下来比较一下差异部分
        if (newChildren.length > oldChildren.length) {
            // 新的子节点多一些，挂载新的子节点
        }
        if (newChildren.length < oldChildren.length) {
            // 新的子节点少一些  删除了子节点
        }
    }
}
```

## 响应式

假设我们有一个这样的程序

``` js
let a = 10
let b = a * 10
```

我们希望a被修改的时候，b也跟着被修改。

这里我们就可以叫做b的修改  是  a的修改的 `副作用 effect`
想像一个EXCEL表格中，我们定义了一个 `公式（function）` ，B列 = A列 * 10，当A的值改变时，B也会随之改变。

事实上，就相当于有个onAchange函数，在a改变时输出b = a * 10

``` js
onAchange(() => {
    b = a * 10
})
/**
 * () => {
    b = a * 10
}  
这个函数就是a改变 所执行 的 副作用
/
```

那么  如何实现这个 onAchange呢？ 联想一下react的 `setState`

``` js
let _state, _update // 定义一个_state 保存state 定义一个_update保存 执行更改的副作用

const onStateChange = update => {
    _update = update // 保存副作用
}

const setState = newState => {
    _state = newState
    _update() // 触发副作用
}
```

setState可以暴露给框架的使用者，显示的调用setState 告诉 框架 应该触发我这个操作的副作用了。

但是在vue中，我们是 `state.a = newValue` 这样去更新一个值得，那么Vue是如何做的呢？

先来看一个简单的vue3提供的新的API使用示例

``` js
import {
    reactive watchEffect
} from 'vue'

// 调用reactive包装state的值 就会返回以一个状态响应式的值
// 包含了依赖收集
const state = reactive({
    count: 0
})
// 追踪这个函数使用过的所有的东西，他执行过程中使用的每一个响应式属性
// 当我们修改state.count的时候这个函数会被再次执行
watchEffect(() => {
    console.log(state.count)
}) // 0
state.count++ // 1
```

这两个API 叫做Composition API，完全独立的，可以与options API共存的新的API。

来看看这两个API是怎么实现的

1. 第一步 我们先让 watchEffect 和依赖跟踪生效

想想这里要做什么

    1. 调用watchEffect 传入一个effect 之后，这个 effect 应该被作为一个副作用，被依赖被收集起来，等待调用
    2. 这个effect 所依赖的参数发生改变时，effct 应该被再次执行

``` js
let activeEffect
// 依赖关系
class Dep {
    constructor(value) {
        this.subscribers = new Set()
        this._value = value
    }
    get value() { // 利用getter自动执行依赖收集
        this.depend()
        return this._value
    }
    set value(newVlue) { // 利用setter自动执行副作用
        this._value = newVlue
        this.notify()
    }
    // 收集依赖
    depend() {
        if (activeEffect) this.subscribers.add(activeEffect)
    }
    // 触发依赖
    notify() {
        this.subscribers.forEach(effect => effect())
    }
}

function watchEffect(effect) {
    activeEffect = effect
    effect()
    activeEffect = null
}
const dep = new Dep('hello')
watchEffect(() => {
    console.log(dep.value)
})
dep.value = 'world!'
```

2. 第二步 实现 reactive 响应式的部分

前面实现的dep类，让dep去保存value，以便触发value变更的时候去触发notify，调用副作用函数。在真正的vue中，则是代理整个对象，让对象的每一个属性，对应一个dep，value是对象的，而不是dep的

所以这里首先，我们要实现这个reactive，那么reavtive究竟做了什么呢？

    1. 代理整个对象，当我们访问对象的属性时，对整个属性加上依赖追踪
    2. 当属性的值改变时，触发依赖追踪，触发副作用

那么，在vue2中，这个事情是由 `Object.defineProperty` 去完成的，他确实完成了代理对象的工作，表现也还不错。但是不可避免的他存在一些缺点：

    1. 需要遍历对象的每一个属性去为每一个属性绑定，遇到对象嵌套的情况还需要递归
    2. 无法处理这个对象身上本身没有的属性的变更
    3. 代理数组时，需要hack到数组的原型上去改变原有的方法，这也是为什么在vue2中直接用 `array[index]` 这样的方式修改数组，不会触发响应式的原因

在vue3中，这个功能的核心就是 `proxy` ，proxy的特性这就就不详细说了，感兴趣的可以自行查阅API，proxy也很好的解决了 `Object.defineProperty` 的痛点。

首先，我们肯定还是需要 `Dep` 这个依赖类，那我们在访问对象的属性时，通过proxy拦截一下这个动作，为这个属性绑定一个依赖追踪，把所有属性都绑定上依赖追踪，就需要有一个东西存储起来，这里选择 `Map` ，那还有就是每一个对象都需要为每一个属性绑定依赖追踪，所以要定位到 `这个属性是这个对象的` ，就还需要在外层再来一个 `Map` ，告诉我们哪个对象对应哪一个 属性依赖Map

结构就是这样的 `对象 => 对象属性的map（ 对象属性 => 属性对应的依赖 ）`

``` js
const targetMap = new WeakMap() // 收集所有 对象和 整个对象 的依赖映射
// 对象 => 对象属性的map（ 对象属性 => 属性对应的依赖 ）
function getDep(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map() // 对象的每一个属性 与 对应的依赖 的映射
        targetMap.set(target, depsMap)
    }
    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep() // 
        depsMap.set(key, dep)
    }
    return dep
}

const reactiveHandler = {
    get(target, key, receiver) {
        const dep = getDep(target, key)
        dep.depend() // 依赖收集
        return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
        const dep = getDep(target, key)
        const result = Reflect.set(target, key, value, receiver)
        dep.notify() // 触发副作用
        return result
    }
}

function reactive(obj) {
    // 代理对象
    return new Proxy(obj, reactiveHandler)
}
```

为什么 `proxy` 解决了 `Object.defineProperty` 的痛点呢？ 你可以看到，这里没有循环，没有递归了。也不用去特殊处理数组了

比如 `array.push` ，它其实会先访问array.length，触发length + 1的操作，这里隐式的调用了get方法触发了依赖收集

## mini-vue3

现在我们有了h函数，有了挂载函数mount，dep依赖类， ractive响应式，watchEffect副作用监听

那么我们现在就实现了一个简单的vue程序，把他们放到一起，写一个 `$mount` 函数，也就是挂载APP的函数

``` js
function mountApp(component, container) {
    let isMounted = false
    let oldDom
    // 当依赖改变时 会再次进入这个副作用函数
    watchEffect(() => {
        // 如果是mounted之前，那就先挂载app
        if (!isMounted) { 
            oldDom = component.render()
            mount(oldDom, container)
            isMounted = true
        } else {
            // 如果app已经挂载，就比较两个Vdom 打补丁
            const newDom = component.render()
            patch(oldDom, newDom)
            oldDom = newDom
        }
    })
}
// ok你已经实现了一个mini-vue3程序
mountApp(App, document.getElementById('app'))
```
