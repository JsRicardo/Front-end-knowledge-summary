# vue面试题

## 单页应用(spa) ***

* 概念

单页Web应用（single page web application，SPA），就是只有一张Web页面的应用，是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。

* 优缺点

单页面应用的优点，正是多页面应用的缺点

单页面是一次性把web应用的所有代码（HTML，JavaScript和CSS）全部请求过来，有时候考虑到首屏加载太慢会按需加载

这样一来，以后用户的每一个动作都不会重新加载页面（即不用再问服务器要页面的HTML，css和js代码），取而代之的是利用 JavaScript 动态的变换HTML的内容（这不需要和服务器交互，除非数据是动态，那么只需要问服务器要数据即可）

* 比较单页应用与多页应用

多页面应用的缺点：每次进入新的页面，都需要向服务器发送请求，要整个页面的所有代码。而且，多次操作后，再次进入该页面时，还得再次请求。不但浪费了网络流量，更重要的是有延迟，用户友好性，用户体验不好。

## MVVM ***

MVVM是Model-View-ViewModel的简写

优点：

1.  低耦合，视图（View）可以独立于Model变化和修改，一个ViewModel可以绑定到不同的”View”上，当View变化的时候Model可以不变，当Model变化的时候View也可以不变
2. 可重用性，可以把一些视图逻辑放在一个ViewModel里面，让很多view重用这段视图逻辑
3. 独立开发，开发人员可以专注于业务逻辑和数据的开发（ViewModel），设计人员可以专注于页面设计，使用Expression Blend可以很容易设计界面并生成xml代码
4. 可测试，界面向来是比较难于测试的，而现在测试可以针对ViewModel来写

示意图

![image](https://user-gold-cdn.xitu.io/2020/2/26/170818fcab34c0ee?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

* 数据的双向绑定

## vue中双向绑定的原理 ***

vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过遍历每一个属性，使用 `Object.defineProperty()` 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调

而vue3的核心则是 `proxy` ，通过proxy拦截获取属性进行依赖收集，通过设置值进行副作用触发，来实现双向绑定

![image](https://user-gold-cdn.xitu.io/2018/6/19/16415ae56618d43f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

vue2主要分为以下几个步骤：

1. 需要 `observe` 的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. `compile解析模板指令` ，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. `Watcher订阅者` 是Observer和Compile之间通信的桥梁，主要做的事情是:

   

    ①在自身实例化时往属性订阅器(dep)里面添加自己

    ②自身必须有一个update()方法

    ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
    

MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果

## data为什么是函数 **

对象为引用类型，当复用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改

而使用返回对象的函数，由于每次返回的都是一个新对象（Object的实例），引用地址不同，则不会出现这个问题

## v-modal原理 * 

v-model其实是 `:value` 和 `$emit('change', data)` 的语法糖，本质上就是数据双向绑定

## v-if 和 v-show ***

v-if和v-show看起来似乎差不多，当条件不成立时，其所对应的标签元素都不可见，但是这两个选项是有区别的:

1. v-if在条件切换时，会对标签进行适当的 `创建和销毁` ，而v-show则仅在初始化时加载一次，后面是设置display来控制显示隐藏。因此v-if的开销相对来说会比v-show大
2. v-if是惰性的，只有当 `条件为真时才会真正渲染标签` ；如果初始条件不为真，则v-if不会去渲染标签。v-show则无论初始条件是否成立，都会渲染标签，它仅仅做的只是简单的CSS切换

## computed watch method **

* 使用方法区别

### computed：

1. computed是一个计算属性，支持 `缓存` ，只有依赖数据发生改变，才会重新进行计算
2. `不支持异步` ，当computed内有异步操作时无效，无法监听数据的变化
3. 如果一个属性是由其他属性计算而来的，这个属性依赖其他属性，是一个多对一或者一对一，一般用computed
4. 每一个computed内都有get和set方法

### watch

1. 不支持缓存，数据变，直接会触发相应的操作
2. watch支持异步
3. 监听的函数接收两个参数，第一个参数是最新的值；第二个参数是输入之前的值
4. watch也可以用对象的方法，提供两个配置项，一个handler处理函数
5. deep：监听器会一层层的往下遍历，给对象的所有属性都加上这个监听器，但是这样性能开销就会非常大了，任何修改obj里面任何一个属性都会触发这个监听器里的 handler
6. immediate：组件加载立即触发回调函数执行

## vue的生命周期 **

* 生命周期顺序
* 哪个阶段有数据
* 哪个阶段可以操作dom
* 父子组件生命周期顺序

## vue组件间通信方式 ***

event bus

父子组件传值 prop emit

双向数据绑定

vuex

## vue单向数据流 *

父组件向子组件传值，子组件通过props接收，这个数据流是单向的，

子组件可以通过emit触发自定义方法向父组件传值

## keep-alive组件 *

保存已经mounted的组件的状态，避免多次刷新造成的性能浪费。一般用于前进刷新，后退去缓存

此组件接收三个属性

    include: 定义缓存名单，keep alive会缓存命中的组件
    exclude：排除的名单
    max：定义缓存组件上限，超出上限使用LRU的策略置换缓存数据。

``` vue
<--在动态组件中的应用—>
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <component :is="currentComponent"></component>
</keep-alive>

<--在vue-router中的应用-->
<keep-alive :include="whiteList" :exclude="blackList" :max="amount">
  <router-view></router-view>
</keep-alive>
```

* 源码解析

1. 组件创建时，初始化两个对象  分别缓存 `VNode` 和 `VNode对应的键` 的集合

``` js
created() {
    this.cache = Object.create(null) // 缓存虚拟dom
    this.keys = [] // 缓存的虚拟dom的健集合
},
```

2. mounted 监听黑白名单的变动

``` js
mounted() {
    // 实时监听黑白名单的变动
    this.$watch('include', val => {
        pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
        pruneCache(this, name => !matches(val, name))
    })
},
```

3. destroyed 删除所有的缓存

``` js
destroyed() {
    for (const key in this.cache) { // 删除所有的缓存
        pruneCacheEntry(this.cache, key, this.keys)
    }
},
```
这里这个`pruneCacheEntry`不是简单的将缓存的组件置为null，而是调用每一个组件的`$destroyed`方法

4. 组件render

由于所有的组件都是包含在keep-alive组件的插槽中的，渲染不同的组件实则是往`$default` slot中插入组件

    第一步：获取keep-alive包裹着的第一个子组件对象及其组件名；
    第二步：根据设定的黑白名单（如果有）进行条件匹配，决定是否缓存。不匹配，直接返回组件实例（VNode），否则执行第三步；
    第三步：根据组件ID和tag生成缓存Key，并在缓存对象中查找是否已缓存过该组件实例。如果存在，直接取出缓存值并更新该key在this.keys中的位置（更新key的位置是实现LRU置换策略的关键），否则执行第四步；
    第四步：在this.cache对象中存储该组件实例并保存key值，之后检查缓存的实例数量是否超过max的设置值，超过则根据LRU置换策略删除最近最久未使用的实例（即是下标为0的那个key）。
    第五步：最后并且很重要，将该组件实例的keepAlive属性值设置为true。

5. 生命周期

缓存的组件只会执行一次`$mount`过程，因为它的`keepAlive`属性为`True`。而想要改变数据，可以通过`activated`钩子函数去修改

在`insert`钩子中，调用了`activateChildComponent`函数递归地去执行所有子组件的`activated`钩子函数

## slot插槽 *

向模板的某一个位置插入指定的内容，可以有default插槽和具名插槽

## vue检测数组或者对象的变化 **

vue2通过 `Object.defineProperty` 代理对象的属性，对整个对象的属性进行递归遍历，每一个属性都被代理，而数组则无法完成这样的代理，所以对数组的代理，其实是对数组原型上的方法的改写。

但是这样就有很多问题，这样以来递归会造成性能的浪费，通常可以用 `Object.freeze` 包裹对象，不让vue去递归遍历，以达到节约性能的目的

defineProperty无法检测这个对象上原先不存在的属性的变化，需要用$set显式的告诉vue再去为这个属性绑定依赖

defineProperty无法代理数组，对数组的监听只能通过vue已经改写的方法来做到，或者一样使用$set

* $set

告诉vue再次为这个对象的这个属性再设定代理

* hack Array.prototype

vue重写了数组原型上面的一些方法，以达到代理数组的目的

## 虚拟DOM ***

抽象语法树 AST

* 原理

当用原生js或者jq去操作真实DOM的时候，浏览器会从构建DOM树开始从头到尾执行一遍流程。当操作次数过多时，之前计算DOM节点坐标值等都是白白浪费的性能，虚拟DOM由此诞生。 

![image](https://user-gold-cdn.xitu.io/2020/3/7/170b414d73437744?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

* 优缺点

假设一次操作中有10次更新DOM的动作，虚拟DOM不会立即操作DOM，而是将这10次更新的`diff`内容保存到本地一个JS对象中，最终将这个JS对象`一次性attch到DOM树上`，再进行后续操作，避免大量无谓的计算量。所以，用JS对象模拟DOM节点的好处是，页面的更新可以先全部反映在虚拟DOM上，操作内存中的JS对象的速度显然要更快，等更新完成后，再将最终的`JS对象映射成真实的DOM`，交由浏览器去绘制。

* diff算法

设定两个demo， 新的nodes中两个li的顺序发生了变化，其余没有任何变化

```js
// old nodes
{
  tag: 'ul',
  children: [
    { tag: 'li', children: [ { vnode: { text: '1' }}]  },
    { tag: 'li', children: [ { vnode: { text: '2' }}]  },
  ]
}

// new nodes
// 将两个li调换顺序
{
  tag: 'ul',
  children: [
+   { tag: 'li', children: [ { vnode: { text: '2' }}]  },
+   { tag: 'li', children: [ { vnode: { text: '1' }}]  },
  ]
}
```

首先响应式数据更新后，触发了 `渲染 Watcher` 的回调函数 `vm._update(vm._render())`去驱动视图更新，这里就是两个li变换了顺序

接着会进入新旧节点的对比，更新的过程，也就是打补丁`patch`的过程

- 过程

1. 是否是相同的节点

`isSameNode`为false的话，直接销毁旧的 vnode，渲染新的 vnode。这也解释了为什么 diff 是`同层对比`。

2. 是相同节点，要尽可能的做节点的复用

进入节点的对比`patchVNode`
    
    1. 如果新 vnode 是文字 vnode 就直接调用浏览器的 dom api 把节点的直接替换掉文字内容就好。
    2. 如果新 vnode 不是文字 vnode 那么就要开始对子节点 children 进行对比了。
    3. 如果有新 children 而没有旧 children 说明是新增 children，直接 addVnodes 添加新子节点。
    4. 如果有旧 children 而没有新 children 说明是删除 children，直接 removeVnodes 删除旧子节点
    5. 如果新旧 children 都存在，接下来就是 diff 算法的最核心部分

vue的diff算法只在同层比较，所以他是`广度优先搜索`，时间复杂度O(n)

![image](https://user-gold-cdn.xitu.io/2020/7/25/17386a63a963b942?w=377&h=199&f=png&s=14641)

先来看看vue怎么比较两个节点是不是同一个节点的

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && ( // key是一个非常重要的比较因素
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      )
    )
  )
}
```

然后我们接着进入 diff 过程，每一轮都是同样的对比，其中某一项命中了，就递归的进入 patchVnode 针对单个 vnode 进行的过程（如果这个 vnode 又有 children，那么还会来到这个 diff children 的过程 ）：

1. 旧首节点和新首节点用 sameNode 对比。
2. 旧尾节点和新尾节点用 sameNode 对比
3. 旧首节点和新尾节点用 sameNode 对比
4. 旧尾节点和新首节点用 sameNode 对比

如果以上逻辑都匹配不到，再把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新 vnode 的 key 去找出在旧节点中可以复用的位置。

然后不停的把匹配到的指针向内部收缩，直到新旧节点有一端的指针相遇（说明这个端的节点都被patch过了）。

在指针相遇以后，还有两种比较特殊的情况：

- 有新节点需要加入：

如果更新完以后，oldStartIdx > oldEndIdx，说明旧节点都被 patch 完了，但是有可能还有新的节点没有被处理到。接着会去判断是否要新增子节点。


- 有旧节点需要删除：

如果新节点先patch完了，那么此时会走 newStartIdx > newEndIdx  的逻辑，那么就会去删除多余的旧子节点。

## key的作用 **

提高节点复用率，提高页面渲染效率

## nextTick的原理 **

来看看Vue官网的说法

    可能你还没有注意到，Vue 在更新 DOM 时是异步执行的。
    只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。
    如果同一个 watcher 被多次触发，只会被推入到队列中一次。
    这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。
    然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。
    Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。

总结一下它的流程就是：

1. 把回调函数放入callbacks等待执行
2. 将执行函数放到微任务或者宏任务中
3. 事件循环到了微任务或者宏任务，执行函数依次执行callbacks中的回调

## vuex ***

* state
* getters
* mutations
* actions
* module
* dispatch和commit的区别

## vue-router两种模式的区别 **

* history
* hash

## vue-router的导航钩子 *

* beforeRouterEnter
