
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
        const oldChildren = n1.children
        const newChildren  = n2.children
        if (typeof newChildren === 'string') {
            
            if (typeof oldChildren === 'string') {
                // 两个节点都是字符节点，内不同时，修改内容
                if (newChildren !== oldChildren) {
                    elm.textContent = newChildren
                }
            } else {
                // 新节是字符 旧节点是 数组 直接替换
                elm.innerHTML = newChildren
            } 

        } else if (Array.isArray(newChildren)) {
            if (typeof oldChildren === 'string') {
                // 旧节点只是字符 新节点是数组 挂载新节点
                elm.innerHTML = ''
                newChildren.forEach(child => {
                    mount(child, elm)
                })
            } else if (Array.isArray(oldChildren)) {
                // 如果两个节点都是数组  这里vue中用到key的模式去判断是不是同一个元素
                // 假设没有key  我们只比较两个数组的 index 相同的部分
                const commonLength = Math.min(newChildren.length, oldChildren.length)

                for(let i = 0; i < commonLength; i++){
                    // 比较一下 公共部分的 每一个child
                   patch(oldChildren[i], newChildren[i])
                }

                // 接下来比较一下差异部分
                if (newChildren.length > oldChildren.length) {
                    // 新的子节点多一些，挂载新的子节点
                    newChildren.slice(oldChildren.length).forEach(child => {
                        mount(child, elm)
                    })
                }

                if (newChildren.length < oldChildren.length) {
                    // 新的子节点少一些  删除了子节点
                    oldChildren.slice(newChildren.length).forEach(child => {
                        elm.removeChild(child.elm)
                    })
                }
            }
        }
    } else {
        // 如果不是的话 就要进行节点替换了，但是又不能直接替换，里面比较复杂
    }
}