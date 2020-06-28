## 01：http报文结构是怎样的？

对于 TCP，传输的时候分为两个部分：`TCP头` 和 `数据部分`

对 HTTP， 也是 header + body。

```
起始行 + 头部 + 空行 + 实体
```

http `请求报文`和`响应报文`有一定区别，所以分开介绍。

### 起始行
对于请求报文来说，起始行类似下面这样:

```http
GET /home HTTP/1.1
```
也就是方法 + 路径 + http版本。

对于响应报文来说，起始行一般张这个样:
```http
HTTP/1.1 200 OK
```

* 响应报文的起始行也叫做状态行。由http版本、状态码和原因三部分组成。

* 在起始行中，每两个部分之间用空格隔开，最后一个部分后面应该接一个换行，严格遵循ABNF语法规范


### 头部
请求头和响应头在报文中的位置:
![](https://s1.ax1x.com/2020/06/20/N1P9mV.jpg)

不管是请求头还是响应头，其中的字段是相当多的，而且牵扯到http非常多的特性，这里就不一一列举的，重点看看这些头部字段的格式：

* 字段名不区分大小写
* 字段名不允许出现空格，不可以出现下划线_
* 字段名后面必须紧接着

### 空行
很重要，用来区分开头部和实体。

问: 如果说在头部中间故意加一个空行会怎么样？

那么空行后的内容全部被视为实体。

### 实体
就是具体的数据了，也就是body部分。请求报文对应请求体, 响应报文对应响应体。

## 02. 如何理解 HTTP 的请求方法？

### 有哪些请求方法？
http/1.1规定了以下请求方法(注意，都是大写):

GET: 通常用来获取资源
HEAD: 获取资源的元信息
POST: 提交数据，即上传数据
PUT: 修改数据
DELETE: 删除资源(几乎用不到)
CONNECT: 建立连接隧道，用于代理服务器
OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
TRACE: 追踪请求-响应的传输路径

### GET 和 POST 有什么区别？
首先最直观的是语义上的区别。

而后又有这样一些具体的差别:

* 从`副作用`的角度，Get 多用于无副作用，POST 多用于副作用。（副作用指对`服务器上的资源做改变`，搜索是无副作用的，注册是副作用的。）
* 从`幂等性`的角度，GET是幂等的，而POST不是。(幂等表示执行相同的操作，`服务器上资源的状态变化`，比如注册 10 个和 11 个帐号是不幂等的，对文章进行更改 10 次和 11 次是幂等的。)
* 从`缓存`的角度，GET 请求会被浏览器主动缓存下来，留下历史记录，而 POST 默认不会。Get 请求能缓存，Post 不能。
* 从`编码`的角度，GET 只能进行 URL 编码，只能接收 ASCII 字符，而 POST 没有限制。（Post 支持更多的编码类型且不对数据类型限制）
* 从`参数`的角度，GET 一般放在 URL 中，因此不安全，POST 放在请求体中，更适合传输敏感信息。
* 从`TCP的角度`，GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)， 然后发 body 部分。(火狐浏览器除外，它的 POST 请求只发一个 TCP 包)
* 从`安全的角度`，Post 相对 Get 安全一点点，因为Get 请求都包含在 URL 里，且会被浏览器保存历史纪录，Post 不会，但是在抓包的情况下都是一样的。
* Post 可以通过 request body来传输比 Get 更多的数据，Get 没有这个技术
* URL有长度限制，会影响 Get 请求，但是这个长度限制是浏览器规定的，不是 RFC 规定的


## 03: 如何理解 URI？

`URI, 全称为(Uniform Resource Identifier)`, 也就是统一资源标识符，它的作用很简单，就是区分互联网上不同的资源。

但是，它并不是我们常说的网址, 网址指的是URL, 实际上URI包含了URN和URL两个部分，由于 URL 过于普及，就默认将 URI 视为 URL 了。

### URI 的结构
URI 真正最完整的结构是这样的。

![](https://s1.ax1x.com/2020/06/20/N1iy5D.png)


可能你会有疑问，好像跟平时见到的不太一样啊！先别急，我们来一一拆解。

* `scheme` 表示协议名，比如http, https, file等等。后面必须和://连在一起。

* `user:passwd@` 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。

* `host:port` 表示主机名和端口。

* `path` 表示请求路径，标记资源所在位置。

* `query` 表示查询参数，为key=val这种形式，多个键值对之间用&隔开。

* `fragment` 表示 URI 所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置。

举个例子:
```
https://www.baidu.com/s?wd=HTTP&rsv_spt=1
```
这个 URI 中，https即scheme部分，www.baidu.com为host:port部分（注意，http 和 https 的默认端口分别为80、443），/s为path部分，而wd=HTTP&rsv_spt=1就是query部分。

### URI 编码
URI 只能使用ASCII, ASCII 之外的字符是不支持显示的，而且还有一部分符号是界定符，如果不加以处理就会导致解析出错。

因此，URI 引入了编码机制，将所有非 ASCII 码字符和界定符转为十六进制字节值，然后在前面加个%。

如，空格被转义成了%20.

## 04: 如何理解 HTTP 状态码？
RFC 规定 HTTP 的状态码为三位数，被分为五类:

1xx: 表示目前是协议处理的中间状态，还需要后续操作。
2xx: 表示成功状态。
3xx: 重定向状态，资源位置发生变动，需要重新请求。
4xx: 请求报文有误。
5xx: 服务器端发生错误。
接下来就一一分析这里面具体的状态码。

### 1xx
101 Switching Protocols。在HTTP升级为WebSocket的时候，如果服务器同意变更，就会发送状态码 101。

### 2xx
200 OK是见得最多的成功状态码。通常在响应体中放有数据。

204 No Content含义与 200 相同，但响应头后没有 body 数据。

206 Partial Content顾名思义，表示部分内容，它的使用场景为 HTTP 分块下载和断电续传，当然也会带上相应的响应头字段Content-Range。

### 3xx
301 Moved Permanently即永久重定向，对应着302 Found，即临时重定向。

302 found，临时性重定向，表示资源临时被分配了新的 URL

比如你的网站从 HTTP 升级到了 HTTPS 了，以前的站点再也不用了，应当返回301，这个时候浏览器默认会做缓存优化，在第二次访问的时候自动访问重定向的那个地址。

而如果只是暂时不可用，那么直接返回302即可，和301不同的是，浏览器并不会做缓存优化。

303 see other，表示资源存在着另一个 URL，应使用 GET 方法获取资源

304 Not Modified: 当协商缓存命中时会返回这个状态码。详见浏览器缓存

### 4xx
400 Bad Request: 开发者经常看到一头雾水，只是笼统地提示了一下错误，并不知道哪里出错了。

401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息

403 Forbidden: 这实际上并不是请求报文出错，而是服务器禁止访问，原因有很多，比如法律禁止、信息敏感。

404 Not Found: 资源未找到，表示没在服务器上找到相应的资源。

405 Method Not Allowed: 请求方法不被服务器端允许。

406 Not Acceptable: 资源无法满足客户端的条件。

408 Request Timeout: 服务器等待了太长时间。

409 Conflict: 多个请求发生了冲突。

413 Request Entity Too Large: 请求体的数据过大。

414 Request-URI Too Long: 请求行里的 URI 太大。

429 Too Many Request: 客户端发送的请求过多。

431 Request Header Fields Too Large请求头的字段内容太大。

### 5xx
500 Internal Server Error: 仅仅告诉你服务器出错了，出了啥错咱也不知道。

501 Not Implemented: 表示客户端请求的功能还不支持。

502 Bad Gateway: 服务器自身是正常的，但访问的时候出错了，啥错误咱也不知道。

503 Service Unavailable: 表示服务器当前很忙，暂时无法响应服务。

## 05: 简要概括一下 HTTP 的特点？HTTP 有哪些缺点？

### HTTP 特点
HTTP 的特点概括如下:

* `灵活可扩展`，主要体现在两个方面。一个是语义上的自由，只规定了基本格式，比如空格分隔单词，换行分隔字段，其他的各个部分都没有严格的语法限制。另一个是传输形式的多样性，不仅仅可以传输文本，还能传输图片、视频等任意数据，非常方便。

* `可靠传输`。HTTP 基于 TCP/IP，因此把这一特性继承了下来。这属于 TCP 的特性，不具体介绍了。

* `请求-应答`。也就是一发一收、有来有回， 当然这个请求方和应答方不单单指客户端和服务器之间，如果某台服务器作为代理来连接后端的服务端，那么这台服务器也会扮演请求方的角色。

* `无状态`。这里的状态是指通信过程的上下文信息，而每次 http 请求都是独立、无关的，默认不需要保留状态信息。

### HTTP 缺点
* `无状态` 所谓的优点和缺点还是要分场景来看的，对于 HTTP 而言，最具争议的地方在于它的无状态。在需要长连接的场景中，需要保存大量的上下文信息，以免传输大量重复的信息，那么这时候无状态就是 http 的缺点了。但与此同时，另外一些应用仅仅只是为了获取一些数据，不需要保存连接上下文信息，无状态反而减少了网络开销，成为了 http 的优点。

* `明文传输` 即协议里的报文(主要指的是头部)不使用二进制数据，而是文本形式。这当然对于调试提供了便利，但同时也让 HTTP 的报文信息暴露给了外界，给攻击者也提供了便利。WIFI陷阱就是利用 HTTP 明文传输的缺点，诱导你连上热点，然后疯狂抓你所有的流量，从而拿到你的敏感信息。

* `队头阻塞问题`. 当 http 开启长连接时，共用一个 TCP 连接，同一时刻只能处理一个请求，那么当前请求耗时过长的情况下，其它的请求只能处于阻塞状态，也就是著名的`队头阻塞`问题。接下来会有一小节讨论这个问题。

## 06：如何解决 HTTP 的队头阻塞问题？
### 什么是 HTTP 队头阻塞？
从前面的小节可以知道，HTTP 传输是基于请求-应答的模式进行的，报文必须是一发一收，但值得注意的是，里面的任务被放在一个任务队列中串行执行，`一旦队首的请求处理太慢，就会阻塞后面请求的处理`。这就是著名的HTTP队头阻塞问题。

### 并发连接

对于一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。在RFC2616规定过客户端最多并发 2 个连接，不过事实上在现在的浏览器标准中，这个上限要多很多，Chrome 中是 6 个。

但其实，即使是提高了并发连接，还是不能满足人们对性能的需求。

### 域名分片

一个域名不是可以并发 6 个长连接吗？那我就多分几个域名。

比如 content1.xylkt.com 、content2.xylkt.com。

这样一个xylkt.com域名下可以分出非常多的二级域名，而它们都指向同样的一台服务器，能够并发的长连接数更多了，事实上也更好地解决了队头阻塞的问题。

### http队头阻塞与tcp队头阻塞区别

http层面上的队头阻塞，是同一个长链接上的多个http请求之间的队头阻塞，只有前面的请求完事儿才轮到后面的请求；

tcp的队头阻塞是数据包层面的，一个请求被分成有序的多个小的数据包，只有序号靠前的包确认完整接收，后续的包才能被处理；否则就不处理一直等这个包重传,这个机制导致的TCP层面的队头阻塞


## 07： http头部的 Content 系列字段了解多少？

对于Content系列字段的介绍分为四个部分: 数据格式、压缩方式、支持语言和字符集。

### 数据格式

上一节谈到 HTTP 灵活的特性，它支持非常多的数据格式，那么这么多格式的数据一起到达客户端，客户端怎么知道它的格式呢？

当然，最低效的方式是直接猜，有没有更好的方式呢？直接指定可以吗？

答案是肯定的。不过首先需要介绍一个标准——`MIME(Multipurpose Internet Mail Extensions`, 多用途互联网邮件扩展)。它首先用在电子邮件系统中，让邮件可以发任意类型的数据，这对于 HTTP 来说也是通用的。

因此，HTTP 从MIME type取了一部分来标记报文 body 部分的数据类型，这些类型体现在 Content-Type 这个字段，当然这是针对于发送端而言，接收端想要收到特定类型的数据，也可以用Accept字段。

具体而言，这两个字段的取值可以分为下面几类:
```http
text： text/html, text/plain, text/css 等
image: image/gif, image/jpeg, image/png 等
audio/video: audio/mpeg, video/mp4 等
application: application/json, application/javascript, application/pdf, application/octet-stream
```


### 压缩方式
当然一般这些数据都是会进行编码压缩的，采取什么样的压缩方式就体现在了发送方的Content-Encoding字段上， 同样的，接收什么样的压缩方式体现在了接受方的Accept-Encoding字段上。这个字段的取值有下面几种：
```http
gzip: 当今最流行的压缩格式
deflate: 另外一种著名的压缩格式
br: 一种专门为 HTTP 发明的压缩算法


// 发送端
Content-Encoding: gzip
// 接收端
Accept-Encoding: gizp
```


### 支持语言
对于发送方而言，还有一个Content-Language字段，在需要实现国际化的方案当中，可以用来指定支持的语言，在接受方对应的字段为Accept-Language。如:

```http
// 发送端
Content-Language: zh-CN, zh, en
// 接收端
Accept-Language: zh-CN, zh, en
```

### 字符集
最后是一个比较特殊的字段, 在接收端对应为Accept-Charset，指定可以接受的字符集，而在发送端并没有对应的Content-Charset, 而是直接放在了Content-Type中，以charset属性指定。如:

```
// 发送端
Content-Type: text/html; charset=utf-8
// 接收端
Accept-Charset: charset=utf-8
```

最后以一张图来总结一下吧:
![](https://s1.ax1x.com/2020/06/20/N1Aavj.png)

## 08：讲一讲 cookie ?

### Cookie 简介

前面说到了 HTTP 是一个无状态的协议，每次 http 请求都是独立、无关的，默认不需要保留状态信息。但有时候需要保存一些状态，怎么办呢？

HTTP 为此引入了 Cookie。Cookie 本质上就是浏览器里面存储的一个很小的文本文件，内部以键值对的方式来存储(在chrome开发者面板的Application这一栏可以看到)。向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 进行解析，便能拿到客户端的状态。而服务端可以通过响应头中的Set-Cookie字段来对客户端写入Cookie。举例如下:
```js
// 请求头
Cookie: a=xxx;b=xxx
// 响应头
Set-Cookie: a=xxx
set-Cookie: b=xxx
```

### Cookie 属性
  生存周期
* Cookie 的有效期可以通过Expires和Max-Age两个属性来设置。
* Expires即过期时间
* Max-Age用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

### 作用域
关于作用域也有两个属性: Domain和path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

### 安全相关

如果 cookie 字段带上`HttpOnly`，那么说明只能通过 HTTP 协议传输，不能通过 JS 访问，这也是预防 XSS 攻击的重要手段。

相应的，对于 CSRF 攻击的预防，也有SameSite属性。

SameSite可以设置为三个值，Strict、Lax和None。

* a. 在Strict模式下，浏览器完全禁止第三方请求携带Cookie。比如请求xylkt.cn网站只能在xylkt.cn域名当中请求才能携带 Cookie，在其他网站请求都不能。

* b. 在Lax模式，就宽松一点了，但是只能在 get 方法提交表单况或者a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。

* c. 在None模式下，也就是默认模式，请求会自动携带上 Cookie。

### Cookie 的缺点

* 容量缺陷。Cookie 的体积上限只有4KB，只能用来存储少量的信息。

* 性能缺陷。Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过Domain和Path指定作用域来解决。

* 安全缺陷。由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在HttpOnly为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。


## 09： 什么是跨域？浏览器如何拦截响应？如何解决？
前后端分离的开发模式中，经常会遇到跨域问题，即 Ajax 请求发出去了，服务器也成功响应了，前端就是拿不到这个响应。接下来我们就来好好讨论一下这个问题。

### 什么是跨域
回顾一下 URI 的组成:
![](https://s1.ax1x.com/2020/06/20/N1iy5D.png)


浏览器遵循同源政策(scheme(协议)、host(主机)和port(端口)都相同则为同源)。非同源站点有这样一些限制:

* 不能读取和修改对方的 DOM
* 不读访问对方的 Cookie、IndexDB 和 LocalStorage
* 限制 XMLHttpRequest 请求。(后面的话题着重围绕这个)


当浏览器向目标 URI 发 Ajax 请求时，只要当前 URL 和目标 URL 不同源，则产生跨域，被称为跨域请求。

> 跨域请求的响应一般会被浏览器所拦截，注意，是被浏览器拦截，响应其实是成功到达客户端了。

### 跨域解决方式有哪些？

* JSONP
* CORS
* document.domain
* postMessage

### CORS

CORS 其实是 W3C 的一个标准，全称是`跨域资源共享`。它需要浏览器和服务器的共同支持，具体来说，非 IE 和 IE10 以上支持CORS，服务器需要附加特定的响应头，后面具体拆解。不过在弄清楚 CORS 的原理之前，我们需要清楚两个概念: `简单请求`和`非简单请求`。

浏览器根据请求方法和请求头的特定字段，将请求做了一下分类，具体来说规则是这样，凡是满足下面条件的属于简单请求:

* 请求方法为 GET、POST 或者 HEAD
* 请求头的取值范围: Accept、Accept-Language、Content-Language、Content-Type(只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain)


> 浏览器画了这样一个圈，在这个圈里面的就是简单请求, 圈外面的就是非简单请求，然后针对这两种不同的请求进行不同的处理。

### 简单请求
请求发出去之前，浏览器做了什么？

它会自动在请求头当中，添加一个Origin字段，用来说明请求来自哪个源。服务器拿到请求之后，在回应时对应地添加`Access-Control-Allow-Origin`字段，如果Origin不在这个字段的范围中，那么浏览器就会将响应拦截。

因此，`Access-Control-Allow-Origin` 字段是服务器用来决定浏览器是否拦截这个响应，这是必需的字段。与此同时，其它一些可选的功能性的字段，用来描述如果不会拦截，这些字段将会发挥各自的作用。

`Access-Control-Allow-Credentials`。这个字段是一个布尔值，表示是否允许发送 Cookie，对于跨域请求，浏览器对这个字段默认值设为 false，而如果需要拿到浏览器的 Cookie，需要添加这个响应头并设为true, 并且在前端也需要设置withCredentials属性:

```js
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

Access-Control-Expose-Headers。这个字段是给 XMLHttpRequest 对象赋能，让它不仅可以拿到基本的 6 个响应头字段（包括Cache-Control、Content-Language、Content-Type、Expires、Last-Modified和Pragma）, 还能拿到这个字段声明的响应头字段。比如这样设置:
```
Access-Control-Expose-Headers: aaa
```
那么在前端可以通过 XMLHttpRequest.getResponseHeader('aaa') 拿到 aaa 这个字段的值。

### 非简单请求
非简单请求相对而言会有些不同，体现在两个方面: 预检请求和响应字段。

我们以 PUT 方法为例。

```js
var url = 'http://xxx.com';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'xxx');
xhr.send();
```
当这段代码执行后，首先会发送预检请求。这个预检请求的请求行和请求体是下面这个格式:

```http
OPTIONS / HTTP/1.1
Origin: 当前地址
Host: xxx.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
```

预检请求的方法是`OPTIONS`，同时会加上Origin源地址和Host目标地址，这很简单。同时也会加上两个关键的字段:

```http
Access-Control-Request-Method, 列出 CORS 请求用到哪个HTTP方法
Access-Control-Request-Headers，指定 CORS 请求将要加上什么请求头
```

这是预检请求。接下来是响应字段，响应字段也分为两部分，一部分是对于预检请求的响应，一部分是对于 CORS 请求的响应。

预检请求的响应。如下面的格式:

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
```

其中有这样几个关键的响应头字段:

```http
Access-Control-Allow-Origin: 表示可以允许请求的源，可以填具体的源名，也可以填*表示允许任意源请求。
Access-Control-Allow-Methods: 表示允许的请求方法列表。
Access-Control-Allow-Credentials: 简单请求中已经介绍。
Access-Control-Allow-Headers: 表示允许发送的请求头字段
Access-Control-Max-Age: 预检请求的有效期，在此期间，不用发出另外一条预检请求。
```

在预检请求的响应返回后，如果请求不满足响应头的条件，则触发XMLHttpRequest的onerror方法，当然后面真正的CORS请求也不会发出去了。

> CORS 请求的响应。绕了这么一大转，到了真正的 CORS 请求就容易多了，现在它和简单请求的情况是一样的。浏览器自动加上Origin字段，服务端响应头返回Access-Control-Allow-Origin。可以参考以上简单请求部分的内容。

### JSONP
虽然XMLHttpRequest对象遵循同源政策，但是script标签不一样，它可以通过 src 填上目标地址从而发出 GET 请求，实现跨域请求并拿到响应。这也就是 JSONP 的原理，接下来我们就来封装一个 JSONP:

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateURL = () => {
    let dataStr = '';
    for(let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callbackName}`;
    return `${url}?${dataStr}`;
  };
  return new Promise((resolve, reject) => {
    // 初始化回调函数名称
    callbackName = callbackName || Math.random().toString.replace(',', ''); 
    // 创建 script 元素并加入到当前文档中
    let scriptEle = document.createElement('script');
    scriptEle.src = generateURL();
    document.body.appendChild(scriptEle);
    // 绑定到 window 上，为了后面调用
    window[callbackName] = (data) => {
      resolve(data);
      // script 执行完了，成为无用元素，需要清除
      document.body.removeChild(scriptEle);
    }
  });
}
```

当然在服务端也会有响应的操作, 以 express 为例:

```js
let express = require('express')
let app = express()
app.get('/', function(req, res) {
  let { a, b, callback } = req.query
  console.log(a); // 1
  console.log(b); // 2
  // 注意哦，返回给script标签，浏览器直接把这部分字符串执行
  res.end(`${callback}('数据包')`);
})
app.listen(3000)
前端这样简单地调用一下就好了:

jsonp({
  url: 'http://localhost:3000',
  params: { 
    a: 1,
    b: 2
  }
}).then(data => {
  // 拿到数据进行处理
  console.log(data); // 数据包
})
```

> 和CORS相比，JSONP 最大的优势在于兼容性好，IE 低版本不能使用 CORS 但可以使用 JSONP，缺点也很明显，请求方法单一，只支持 GET 请求。

### document.domain

该方式只能用于二级域名相同的情况下，比如 `a.test.com` 和 `b.test.com` 适用于该方式。

只需要给页面添加 `document.domain = 'test.com'` 表示二级域名都相同就可以实现跨域

### postMessage
这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
```

## 10：HTTP/2 有哪些改进？

HTTP 2.0 相比于 HTTP 1.X，可以说是大幅度提高了 web 的性能。

在 HTTP 1.X 中，为了性能考虑，我们会引入雪碧图、将小图内联、使用多个域名等等的方式。这一切都是因为浏览器限制了`同一个域名下的请求数量`，当页面中需要请求很多资源的时候，`队头阻塞（Head of line blocking）`会导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求。

### 二进制传输
HTTP 2.0 中所有加强性能的核心点在于此。在之前的 HTTP 版本中，我们是通过文本的方式传输数据。在 HTTP 2.0 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码。

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-43760.png)

### 多路复用
在 HTTP 2.0 中，有两个非常重要的概念，分别是帧（frame）和流（stream）。

* 帧代表着最小的数据单位，每个帧会标识出该帧属于哪个流
* 流也就是多个帧组成的数据流。

> 多路复用，就是在一个 TCP 连接中可以存在多条流。换句话说，也就是可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能。

![](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043800.png)


### Header 压缩
在 HTTP 1.X 中，我们使用文本的形式传输 header，在 header 携带 cookie 的情况下，可能每次都需要重复传输几百到几千的字节。

在 HTTP 2.0 中，使用了 HPACK 压缩格式对传输的 header 进行编码，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header ，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值。

### 服务端 Push
在 HTTP 2.0 中，服务端可以在客户端某个请求后，主动推送其他资源。

可以想象以下情况，某些资源客户端是一定会请求的，这时就可以采取服务端 push 的技术，提前给客户端推送必要的资源，这样就可以相对减少一点延迟时间。当然在浏览器兼容的情况下你也可以使用 prefetch 。


## 11：QUIC 协议？

这是一个谷歌出品的基于 UDP 实现的同为传输层的协议，目标很远大，希望替代 TCP 协议。

* 该协议支持多路复用，虽然 HTTP 2.0 也支持多路复用，但是下层仍是 TCP，因为 TCP 的重传机制，只要一个包丢失就得判断丢失包并且重传，导致发生队头阻塞的问题，但是 UDP 没有这个机制
* 实现了自己的加密协议，通过类似 TCP 的 TFO 机制可以实现 0-RTT，当然 TLS 1.3 已经实现了 0-RTT 了
* 支持重传和纠错机制（向前恢复），在只丢失一个包的情况下不需要重传，使用纠错机制恢复丢失的包
    * 纠错机制：通过异或的方式，算出发出去的数据的异或值并单独发出一个包，服务端在发现有一个包丢失的情况下，通过其他数据包和异或值包算出丢失包
    * 在丢失两个包或以上的情况就使用重传机制，因为算不出来了