# vue3原理 - mini-vue3

## 挂载dom

首先，还是从挂载一个dom元素开始

vue3中我们可以利用暴露出来的`h`函数来渲染一个模版，他接收的参数就是一个用js表示的dom结构 `tag标签，属性，孩子节点`

假设我们有一个用js构建的vdom的模版，长这样

```js
const vdom = h('div', {class: 'red'}, [
    h('span', null, 'hello')
])
```
那么接下来我们就该解析这个结构，用以把他挂载到真实的dom结构上

假设我们已经实现了一个mount方法，那么我们就只需要调用mount方法完成挂载

```js
// 传入要挂载的虚拟dom，和父节点
mount(vdom, document.getElementById('app'))
```

如此mount方法需要解决的就是

- 解析vdom
- 解析props（假设这里只有attr，没有props，一些其他自定义属性）
- 解析children子节点

```js
// 挂载元素
function mount(vNode, container) {
    const elm = document.createElement(vNode.tag)

    // props
    if (vNode.props) {
        for (const key in vNode.props) {
            const attr = vNode.props[key]
            elm.setAttribute(key, attr)
        }   
    }
    // children
    if (vNode.children) {
        if (typeof vNode.children === 'string'){
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

```js
const vdom2 = h('div', {class: 'red'}, [
    h('span', null, 'hello')
])
patch(vdom, vdom2)
```
这里需要对比新旧的vdom，所以我们对mount改造一下，存储一下真实dom结构，方便后面操作。
```js
const elm = vNode.elm = document.createElement(vNode.tag)
```
这要就可以通过vdom.elm访问真实的dom结构