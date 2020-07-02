# GET和POST的区别

get和post的到底有什么区别呢？这得根据前提来定。

## 没有前提

在没有任何前提的情况下，也就是不考虑规范，只考虑语法的话，这两个方式是没有什么区别的，仅仅是名字不一样

## 基于RFC规范

基于RFC规范也不能具体确定有什么区别，害得看是基于RFC理论还是基于实现的。

### 基于RFC理论

如果是基于RFC理论的，我们称这个为Specification。那么GET和POST是具有相同的语法，但是不具备相同的语义，GET方式用作获取信息，POST方式用作发送信息。

### 基于RFC实现

如果是基于RFC实现的，我们称之为implementation。其实要区分是具体的哪一种实现。我们通常默认指的是`浏览器实现的RFC`。当然不止浏览器，我们任何人都可以设计一个HTTP协议的接口，使用RFC规范，当然这些是我们不用考虑的，因为这并不是通用的。

所以，考虑浏览器实现的RFC，或者是WEB环境下的RFC，GET和POST的区别：

1. get请求中，数据在url中是可见的，而post是不可见的，它放在body中
2. get请求对数据的长度有限制，因为get方法是向url添加数据，而url的长度是有限制的（最大长度为2048个字符），post无此限制
3. get可以被收藏为书签，post则不能
4. get在浏览器后退，或者刷新的时候无影响，post的数据则会被重新提交
5. get的历史参数会被保存在浏览器历史中，post不会
6. get方式只允许ASCII码字符，post则不止，它还可以传输二进制数据
7. get的编码类型为`application/x-www-form-url`，post编码类型encodedapplication/x-www-form-urlencoded 或 multipart/form-data。为二进制数据使用多重编码
8. 与post相比，get的安全性**相对较差**，因为所发送的数据是url的一部分。在发送密码或其他敏感信息时绝不要使用get！post比get更安全，`因为参数不会被保存在浏览器历史或web服务器日志中`
9. 从TCP的角度，get请求会把请求报文一次性发出去，而post会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的post请求只发一个 TCP 包)