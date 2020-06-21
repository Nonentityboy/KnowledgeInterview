## 01: nodejs中的异步、非阻塞I/O

### 1. 什么是I/O？
I/O 即Input/Output, 输入和输出的意思。

* 浏览器端，只有一种 I/O，那就是利用 Ajax 发送网络请求，然后读取返回的内容，这属于网络I/O。
* 回到 nodejs 中，主要分为两种:
  * 文件 I/O。比如用 fs 模块对文件进行读写操作。
  * 网络 I/O。比如 http 模块发起网络请求。

### 2. 阻塞和非阻塞I/O
`阻塞和非阻塞 I/O 其实是针对操作系统内核而言`，而不是 nodejs 本身。

* 阻塞 I/O 的特点就是一定要等到操作系统完成所有操作后才表示调用结束
* 非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。

对前者而言，在操作系统进行 I/O 的操作的过程中，我们的应用程序其实是一直处于等待状态的，什么都做不了。那如果换成非阻塞I/O，调用返回后我们的 nodejs 应用程序可以完成其他的事情，而操作系统同时也在进行 I/O。这样就把等待的时间充分利用了起来，提高了执行效率，但是同时又会产生一个问题，nodejs 应用程序怎么知道操作系统已经完成了 I/O 操作呢？

为了让 nodejs 知道操作系统已经做完 I/O 操作，需要重复地去操作系统那里判断一下是否完成，这种重复判断的方式就是轮询。对于轮询而言，有以下这么几种方案:

* 一直轮询检查I/O状态，直到 I/O 完成。这是最原始的方式，也是性能最低的，会让 CPU 一直耗用在等待上面。其实跟阻塞 I/O 的效果是一样的。

* 遍历文件描述符(即 文件I/O 时操作系统和 nodejs 之间的文件凭证)的方式来确定 I/O 是否完成，I/O完成则文件描述符的状态改变。但 CPU 轮询消耗还是很大。

* epoll模式。即在进入轮询的时候如果I/O未完成CPU就休眠，完成之后唤醒CPU。


> 总之，CPU要么重复检查I/O，要么重复检查文件描述符，要么休眠，都得不到很好的利用，我们希望的是: nodejs 应用程序发起 I/O 调用后可以直接去执行别的逻辑，操作系统默默地做完 I/O 之后给 nodejs 发一个完成信号，nodejs 执行回调操作。

### 异步 I/O 的本质
Linux 原生存在这样的一种方式，即(AIO), 但两个致命的缺陷:

* 只有 Linux 下存在，在其他系统中没有异步 I/O 支持。
* 无法利用系统缓存。

### nodejs中的异步 I/O 方案
是不是没有办法了呢？在单线程的情况下确实是这样，但是如果把思路放开一点，利用多线程来考虑这个问题，就变得轻松多了。

可以让一个进程进行计算操作，另外一些进行 I/O 调用，I/O 完成后把信号传给计算的线程，进而执行回调，这不就好了吗？没错，异步 I/O 就是使用这样的线程池来实现的。

只不过在不同的系统下面表现会有所差异，在 Linux 下可以直接使用线程池来完成，在Window系统下则采用 IOCP 这个系统API(其内部还是用线程池完成的)。

有了操作系统的支持，那 nodejs 如何来对接这些操作系统从而实现异步 I/O 呢？

以文件为 I/O 我们以一段代码为例:

```js
let fs = require('fs');

fs.readFile('/test.txt', function (err, data) {
    console.log(data); 
});
```

#### 执行流程
执行代码的过程中大概发生了这些事情:

首先，fs.readFile调用Node的核心模块`fs.js` ；
接下来，Node的核心模块调用内建模块node_file.cc，创建对应的文件I/O观察者对象(这个对象后面有大用！) ；
最后，根据不同平台（Linux或者window），内建模块通过libuv中间层进行系统调用。

![](https://s1.ax1x.com/2020/06/21/N8QLhd.png)


### libuv调用过程拆解
重点来了！`libuv` 中是如何来进行进行系统调用的呢？也就是 `uv_fs_open()` 中做了些什么？

#### 1. 创建请求对象
以Windows系统为例来说，在这个函数的调用过程中，我们创建了一个文件I/O的请求对象，并往里面注入了回调函数。
```js
req_wrap->object_->Set(oncomplete_sym, callback);
```
req_wrap 便是这个请求对象，req_wrap 中 object_ 的 oncomplete_sym 属性对应的值便是我们 nodejs 应用程序代码中传入的回调函数。

#### 2. 推入线程池，调用返回
在这个对象包装完成后，QueueUserWorkItem() 方法将这个对象推进线程池中等待执行。

好，至此现在js的调用就直接返回了，我们的 js 应用程序代码可以继续往下执行，当然，当前的 I/O 操作同时也在线程池中将被执行，这不就完成了异步么：）

等等，别高兴太早，回调都还没执行呢！接下来便是执行回调通知的环节。

#### 3. 回调通知
事实上现在线程池中的 I/O 无论是阻塞还是非阻塞都已经无所谓了，因为异步的目的已经达成。重要的是 I/O 完成后会发生什么。

在介绍后续的故事之前，给大家介绍两个重要的方法: GetQueuedCompletionStatus 和 PostQueuedCompletionStatus。

还记得之前讲过的 eventLoop 吗？在每一个Tick当中会调用GetQueuedCompletionStatus检查线程池中是否有执行完的请求，如果有则表示时机已经成熟，可以执行回调了。

PostQueuedCompletionStatus方法则是向 IOCP 提交状态，告诉它当前I/O完成了。

名字比较长，先介绍是为了让大家混个脸熟，至少后面出来不会感到太突兀：）

我们言归正传，把后面的过程串联起来。

当对应线程中的 I/O 完成后，会将获得的结果存储起来，保存到相应的请求对象中，然后调用PostQueuedCompletionStatus()向 IOCP 提交执行完成的状态，并且将线程还给操作系统。一旦 EventLoop 的轮询操作中，调用GetQueuedCompletionStatus检测到了完成的状态，就会把请求对象塞给I/O观察者(之前埋下伏笔，如今终于闪亮登场)。

I/O 观察者现在的行为就是取出请求对象的存储结果，同时也取出它的oncomplete_sym属性，即回调函数(不懂这个属性的回看第1步的操作)。将前者作为函数参数传入后者，并执行后者。 这里，回调函数就成功执行啦！

>总结 :<br>
1.阻塞和非阻塞 I/O 其实是针对操作系统内核而言的。阻塞 I/O 的特点就是一定要等到操作系统完成所有操作后才表示调用结束，而非阻塞 I/O 是调用后立马返回，不用等操作系统内核完成操作。<br>
2.nodejs中的异步 I/O 采用多线程的方式，由 EventLoop、I/O 观察者，请求对象、线程池四大要素相互配合，共同实现。


## 02：Promise(一)——Promise怎样消灭回调地狱？

### 1. 什么是回调地狱？
* 多层嵌套
* 每种任务的处理结果存在两个可能性（成功或失败），则此时需要在每种任务执行结束后分别处理这两种可能

这两种问题在回调函数时代非常突出，Promise的诞生就为了解决这俩问题。

### 2. Promise 怎样解决了回调地狱？
* 回调函数延迟绑定
* 返回值穿透
* 错误冒泡

举个例子:
```js
let readFilePromise = (filename) => {
  fs.readFile(filename, (err, data) => {
    if(err) {
      reject(err);
    }else {
      resolve(data);
    }
  })
}
readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')
});
```


回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入。这就是回调函数延迟绑定。

然后我们做以下微调:
```js
let x = readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')//这是返回的Promise
});
x.then(/* 内部逻辑省略 */)
```

> 我们会根据 then 中回调函数的传入值创建不同类型的Promise, 然后把`返回的 Promise 穿透到外层`, 以供后续的调用。这里的 x 指的就是内部返回的 Promise，然后在 x 后面可以依次完成链式调用。

这便是`返回值穿透的效果`。

这两种技术一起作用便可以将深层的嵌套回调写成下面的形式:

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
});
```

就显得清爽了许多，更重要的是，它更符合人的线性思维模式，开发体验也更好。

两种技术结合产生了链式调用的效果。

这解决的是多层嵌套的问题，那另一个问题，即每次任务执行结束后分别处理成功和失败的情况怎么解决的呢？

Promise 采用了错误冒泡的方式。其实很简单理解，我们来看看效果:

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
}).catch(err => {
  // xxx
})
```
这样前面产生的错误会一直向后传递，被 `catch` 接收到，就不用频繁地检查错误了。

### 解决效果
* 实现链式调用，解决多层嵌套问题
* 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题


## 03: Promise之问(二)——为什么Promise要引入微任务？

Promise 中的执行函数是同步进行的，但是里面存在着异步操作，在异步操作结束后会调用 resolve 方法，或者中途遇到错误调用 reject 方法，这两者都是作为微任务进入到 EventLoop 中。但是你有没有想过，Promise 为什么要引入微任务的方式来进行回调操作。

### 解决方式
回到问题本身，其实就是如何处理回调的问题。总结起来有三种方式:

1. 使用同步回调，直到异步任务进行完，再进行后面的任务。
2. 使用异步回调，将回调函数放在进行宏任务队列的队尾。
3. 使用异步回调，将回调函数放到当前宏任务中的最后面。


### 优劣对比
第一种方式显然不可取，因为同步的问题非常明显，会让整个脚本阻塞住，当前任务等待，后面的任务都无法得到执行，而这部分等待的时间是可以拿来完成其他事情的，导致 CPU 的利用率非常低，而且还有另外一个致命的问题，就是无法实现延迟绑定的效果。

如果采用第二种方式，那么执行回调(resolve/reject)的时机应该是在前面所有的宏任务完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成应用卡顿。

为了解决上述方案的问题，另外也考虑到延迟绑定的需求，Promise 采取第三种方式, 即引入微任务, 即把 resolve(reject) 回调的执行放在`当前宏任务的末尾`。

这样，利用微任务解决了两大痛点:

* 采用异步回调替代同步回调解决了浪费 CPU 性能的问题。
* 放到当前宏任务最后执行，解决了回调执行的实时性问题。


## 04：谈谈你对生成器以及协程的理解。
生成器(Generator)是 ES6 中的新语法，相对于之前的异步语法，上手的难度还是比较大的。因此这里我们先来好好熟悉一下 Generator 语法。

### 生成器执行流程
上面是生成器函数？

生成器是一个带星号的"函数"(注意：它并不是真正的函数)，可以通过yield关键字暂停执行和恢复执行的

举个例子:
```js
function* gen() {
  console.log("enter");
  let a = yield 1;
  let b = yield (function () {return 2})();
  return 3;
}
var g = gen() // 阻塞住，不会执行任何语句
console.log(typeof g)  // object  看到了吗？不是"function"

console.log(g.next())  
console.log(g.next())  
console.log(g.next())  
console.log(g.next()) 


// enter
// { value: 1, done: false }

// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
```

由此可以看到，生成器的执行有这样几个关键点:

* 调用 gen() 后，程序会阻塞住，不会执行任何语句。
* 调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停。
* next 方法返回一个对象， 有两个属性: value 和 done。value 为当前 yield 后面的结果，done 表示是否执行完，遇到了return 后，done 会由false变为true。

### yield*
当一个生成器要调用另一个生成器时，使用 yield* 就变得十分方便。比如下面的例子:

```js
function* gen1() {
    yield 1;
    yield 4;
}
function* gen2() {
    yield 2;
    yield 3;
}
```
我们想要按照1234的顺序执行，如何来做呢？

在 gen1 中，修改如下:

```js
function* gen1() {
    yield 1;
    yield* gen2();
    yield 4;
}
```
这样修改之后，之后依次调用next即可。

### 生成器实现机制——协程
可能你会比较好奇，生成器究竟是如何让函数暂停, 又会如何恢复的呢？接下来我们就来对其中的执行机制——协程一探究竟。

#### 什么是协程？
协程是一种比线程更加轻量级的存在，协程处在线程的环境中，一个线程可以存在多个协程，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

#### 协程的运作过程
那你可能要问了，JS 不是单线程执行的吗，开这么多协程难道可以一起执行吗？

答案是：并不能。一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将JS 线程的控制权转交给 B协程，那么现在 B 执行，A 就相当于处于暂停的状态。

举个具体的例子:
```js
function* A() {
  console.log("我是A");
  yield B(); // A停住，在这里转交线程执行权给B
  console.log("结束了");
}
function B() {
  console.log("我是B");
  return 100;// 返回，并且将线程执行权还给A
}
let gen = A();
gen.next();
gen.next();

// 我是A
// 我是B
// 结束了
```

在这个过程中，A 将执行权交给 B，也就是 A 启动 B，我们也称 A 是 B 的父协程。因此 B 当中最后return 100其实是将 100 传给了父协程。

需要强调的是，对于协程来说，它并不受操作系统的控制，完全由用户自定义切换，因此并没有进程/线程上下文切换的开销，这是高性能的重要原因。

OK, 原理就说到这里。可能你还会有疑问: 这个生成器不就暂停-恢复、暂停-恢复这样执行的吗？它和异步有什么关系？而且，每次执行都要调用next，能不能让它一次性执行完毕呢？下一节我们就来仔细拆解这些问题。



## 05：如何让 Generator 的异步代码按顺序执行完毕？
这里面其实有两个问题:

* Generator 如何跟异步产生关系？
* 怎么把 Generator 按顺序执行完毕？

### thunk 函数
要想知道 Generator 跟异步的关系，首先带大家搞清楚一个概念——thunk函数(即偏函数)，虽然这只是实现两者关系的方式之一。(另一种方式是Promise, 后面会讲到)

举个例子，比如我们现在要判断数据类型。可以写如下的判断逻辑:

```js
let isString = (obj) => {
  return Object.prototype.toString.call(obj) === '[object String]';
};
let isFunction = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Function]';
};
let isArray = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Array]';
};
let isSet = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Set]';
};
// ...
```
可以看到，出现了非常多重复的逻辑。我们将它们做一下封装:

```js
let isType = (type) => {
  return (obj) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  }
}
```
现在我们这样做即可:

```js
let isString = isType('String');
let isFunction = isType('Function');
//...
```

相应的 isString和isFunction是由isType生产出来的函数，但它们依然可以判断出参数是否为String（Function），而且代码简洁了不少。
```js
isString("123");
isFunction(val => val);
```
isType这样的函数我们称为thunk 函数。它的核心逻辑是接收一定的参数，生产出定制化的函数，然后使用定制化的函数去完成功能。thunk函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂，大大方便了后续的操作。

### Generator 和 异步

#### thunk 版本
以文件操作为例，我们来看看 异步操作 如何应用于Generator。

```js
const readFileThunk = (filename) => {
  return (callback) => {
    fs.readFile(filename, callback);
  }
}
```
readFileThunk就是一个thunk函数。异步操作核心的一环就是绑定回调函数，而thunk函数可以帮我们做到。首先传入文件名，然后生成一个针对某个文件的定制化函数。这个函数中传入回调，这个回调就会成为异步操作的回调。这样就让 Generator 和异步关联起来了。

紧接者我们做如下的操作:

```js
const gen = function* () {
  const data1 = yield readFileThunk('001.txt')
  console.log(data1.toString())
  const data2 = yield readFileThunk('002.txt')
  console.log(data2.toString)
}
```
接着我们让它执行完:

```js
let g = gen();
// 第一步: 由于进场是暂停的，我们调用next，让它开始执行。
// next返回值中有一个value值，这个value是yield后面的结果，放在这里也就是是thunk函数生成的定制化函数，里面需要传一个回调函数作为参数
g.next().value((err, data1) => {
  // 第二步: 拿到上一次得到的结果，调用next, 将结果作为参数传入，程序继续执行。
  // 同理，value传入回调
  g.next(data1).value((err, data2) => {
    g.next(data2);
  })
})
```

打印结果如下:
```
001.txt的内容
002.txt的内容
```
上面嵌套的情况还算简单，如果任务多起来，就会产生很多层的嵌套，可操作性不强，有必要把执行的代码封装一下:

```js
function run(gen){
  const next = (err, data) => {
    let res = gen.next(data);
    if(res.done) return;
    res.value(next);
  }
  next();
}
run(g);
```
Ok,再次执行，依然打印正确的结果。代码虽然就这么几行，但包含了递归的过程，好好体会一下。

这是通过thunk完成异步操作的情况。

#### Promise 版本
还是拿上面的例子，用Promise来实现就轻松一些:

```js
const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if(err) {
        reject(err);
      }else {
        resolve(data);
      }
    })
  }).then(res => res);
}
const gen = function* () {
  const data1 = yield readFilePromise('001.txt')
  console.log(data1.toString())
  const data2 = yield readFilePromise('002.txt')
  console.log(data2.toString)
}
```
执行的代码如下:
```js
let g = gen();
function getGenPromise(gen, data) { 
  return gen.next(data).value;
}
getGenPromise(g).then(data1 => {
  return getGenPromise(g, data1);
}).then(data2 => {
  return getGenPromise(g, data2)
})
```
打印结果如下:

```
001.txt的内容
002.txt的内容
```
同样，我们可以对执行Generator的代码加以封装:
```js
function run(g) {
  const next = (data) => {
    let res = g.next();
    if(res.done) return;
    res.value.then(data => {
      next(data);
    })
  }
  next();
}
```
同样能输出正确的结果。代码非常精炼，希望能参照刚刚链式调用的例子，仔细体会一下递归调用的过程。

#### 采用 co 库
以上我们针对 thunk 函数和Promise两种Generator异步操作的一次性执行完毕做了封装，但实际场景中已经存在成熟的工具包了，如果大名鼎鼎的co库, 其实核心原理就是我们已经手写过了（就是刚刚封装的Promise情况下的执行代码），只不过源码会各种边界情况做了处理。使用起来非常简单:

```js
const co = require('co');
let g = gen();
co(g).then(res =>{
  console.log(res);
})
```
打印结果如下:
```js
001.txt的内容
002.txt的内容
```

简单几行代码就完成了Generator所有的操作，co和Generator天生一对

## 06：解释一下async/await的运行机制。

async/await被称为 JS 中异步终极解决方案。它既能够像` co + Generator` 一样用同步的方式来书写异步代码，又得到底层的语法支持，无需借助任何第三方库。接下来，我们从原理的角度来重新审视这个语法糖背后究竟做了些什么。

### async
什么是 async ?

> MDN 的定义: async 是一个通过异步执行并隐式返回 Promise 作为结果的函数。

重点: 返回结果为Promise。

举个例子:
```js
async function func() {
  return 100;
}
console.log(func());
// Promise {<resolved>: 100}
```
这就是隐式返回 Promise 的效果。

### await
我们来看看 await做了些什么事情。

以一段代码为例:
```js
async function test() {
  console.log(100)
  let x = await 200
  console.log(x)
  console.log(200)
}
console.log(0)
test()
console.log(300)
```

我们来分析一下这段程序。首先代码同步执行，打印出0，然后将test压入执行栈，打印出100, 下面注意了，遇到了关键角色await。

放个慢镜头:
```js
await 100;
```
被 JS 引擎转换成一个 Promise :

```js
let promise = new Promise((resolve,reject) => {
   resolve(200);
})
```
这里调用了 resolve，resolve的任务进入微任务队列。

然后，JS 引擎将暂停当前协程的运行，把线程的执行权交给`父协程`。

回到父协程中，父协程的第一件事情就是对await返回的Promise调用then, 来监听这个 Promise 的状态改变 。

```js
promise.then(value => {
  // 相关逻辑，在resolve 执行之后来调用
})
```
然后往下执行，打印出300。

根据EventLoop机制，当前主线程的宏任务完成，现在检查微任务队列, 发现还有一个Promise的 resolve，执行，现在父协程在then中传入的回调执行。我们来看看这个回调具体做的是什么。

```js
promise.then(value => {
  // 1. 将线程的执行权交给test协程
  // 2. 把 value 值传递给 test 协程
})
```
Ok, 现在执行权到了test协程手上，test 接收到父协程传来的200, 赋值给 a ,然后依次执行后面的语句，打印200、200。

最后的输出为:
```
0
100
300
200
200
```

> 总结一下，async/await利用协程和Promise实现了同步方式编写异步代码的效果，其中Generator是对协程的一种实现，虽然语法简单，但引擎在背后做了大量的工作，我们也对这些工作做了一一的拆解。用async/await写出的代码也更加优雅、美观，相比于之前的Promise不断调用then的方式，语义化更加明显，相比于co + Generator性能更高，上手成本也更低，不愧是JS异步终极解决方案！