
function h(tag, props, children) {
    return {
        tag,
        props,
        children
    }
}

// 挂载元素
function mount(vNode, container) {
    const elm = vNode.elm = document.createElement(vNode.tag)

    // props
    if (vNode.props) {
        for (const key in vNode.props) {
            const attr = vNode.props[key]
            elm.setAttribute(key, attr)
        }
    }
    // children
    if (vNode.children) {
        if (typeof vNode.children === 'string') {
            elm.textContent = vNode.children
        } else {
            vNode.children.forEach(child => {
                mount(child, elm)
            })
        }
    }
    container.appendChild(elm)
}

// 这里暂时不讨论diff算法的优化 只探讨实现它的原理
function patch(n1, n2) {
    // 如果两个节点的标签是一样的可以直检查里面的prop和children
    if (n1.tag === n2.tag) {
        const elm = n2.elm = n1.elm
        // 比较props
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

        // 比较children
        
    } else {
        // 如果不是的话 就要进行节点替换了，但是又不能直接替换，里面比较复杂
    }
}