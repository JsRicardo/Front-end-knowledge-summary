# vue面试题

## 单页应用(spa) ***

- 概念

单页Web应用（single page web application，SPA），就是只有一张Web页面的应用，是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。

- 优缺点

单页面应用的优点，正是多页面应用的缺点

单页面是一次性把web应用的所有代码（HTML，JavaScript和CSS）全部请求过来，有时候考虑到首屏加载太慢会按需加载

这样一来，以后用户的每一个动作都不会重新加载页面（即不用再问服务器要页面的HTML，css和js代码），取而代之的是利用 JavaScript 动态的变换HTML的内容（这不需要和服务器交互，除非数据是动态，那么只需要问服务器要数据即可）

- 比较单页应用与多页应用

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

- 数据的双向绑定

## vue中双向绑定的原理 ***
vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过遍历每一个属性，使用`Object.defineProperty()`来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调

而vue3的核心则是`proxy`，通过proxy拦截获取属性进行依赖收集，通过设置值进行副作用触发，来实现双向绑定

![image](https://user-gold-cdn.xitu.io/2018/6/19/16415ae56618d43f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

vue2主要分为以下几个步骤：

1. 需要`observe`的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化
2. `compile解析模板指令`，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
3. `Watcher订阅者`是Observer和Compile之间通信的桥梁，主要做的事情是:
   
    ①在自身实例化时往属性订阅器(dep)里面添加自己

    ②自身必须有一个update()方法

    ③待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。
    
MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，通过Observer来监听自己的model数据变化，通过Compile来解析编译模板指令，最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果

## data为什么是函数 **

对象为引用类型，当复用组件时，由于数据对象都指向同一个data对象，当在一个组件中修改data时，其他重用的组件中的data会同时被修改

而使用返回对象的函数，由于每次返回的都是一个新对象（Object的实例），引用地址不同，则不会出现这个问题

## v-modal原理 * 

v-model其实是`:value`和`$emit('change', data)`的语法糖，本质上就是数据双向绑定

## v-if 和 v-show ***
v-if和v-show看起来似乎差不多，当条件不成立时，其所对应的标签元素都不可见，但是这两个选项是有区别的:

1. v-if在条件切换时，会对标签进行适当的`创建和销毁`，而v-show则仅在初始化时加载一次，后面是设置display来控制显示隐藏。因此v-if的开销相对来说会比v-show大
2. v-if是惰性的，只有当`条件为真时才会真正渲染标签`；如果初始条件不为真，则v-if不会去渲染标签。v-show则无论初始条件是否成立，都会渲染标签，它仅仅做的只是简单的CSS切换

## computed watch method **

- 使用方法区别

### computed：

1. computed是一个计算属性，支持`缓存`，只有依赖数据发生改变，才会重新进行计算
2. `不支持异步`，当computed内有异步操作时无效，无法监听数据的变化
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

- 生命周期顺序
- 哪个阶段有数据
- 哪个阶段可以操作dom
- 父子组件生命周期顺序

## vue组件间通信方式 ***

## vue单向数据流 *

## keep-alive组件 *

## slot插槽 *

## vue检测数组或者对象的变化 **

- $set
- hack Array.prototype

## 虚拟DOM ***

- 原理
- 优缺点
- diff算法

## key的作用 **

## nextTick的原理 **

## vuex ***

- state
- getters
- mutations
- actions
- module
- dispatch和commit的区别

## vue-router两种模式的区别 **

- history
- hash

## vue-router的导航钩子 *

- beforeRouterEnter