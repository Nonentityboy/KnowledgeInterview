## 01：JS数据类型—基本概念

### 1. JS原始数据类型有哪些？引用数据类型有哪些？
JS 中，存在着 7 种原始类型，分别是：<br>
`boolean` `null` `undefined` `number` `string` `symbol` `bigint`

引用数据类型: 对象Object（ `普通对象-Object`，`数组对象-Array`，`正则对象-RegExp`，`日期对象-Date`，`数学函数-Math`，`函数对象-Function`）


### 2. 0.1+0.2为什么不等于0.3？
`0.1+0.2为什么不等于0.3`，0.1和0.2在`转换成二进制后会无限循环`，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。
<b>JS 采用 `IEEE 754 双精度版本（64位）`，并且只要采用 IEEE 754 的语言都有该问题。</b>

其中 `JS 的数字类型是 浮点类型` 的，没有整型。并且浮点类型基于 `IEEE 754` 标准实现，在使用中会遇到某些 Bug。NaN 也属于 number 类型，并且 NaN 不等于自身。

### 3. null是对象吗？

在 JS 的最初版本中使用的是 `32 位系统`，为了性能考虑使用低位存储变量的类型信息，000 开头代表是对象然而 null 表示为全零，所以将它错误的判断为 object。

null 不是对象, 虽然 `typeof null` 会输出 `object`，但是这只是 JS 存在的一个悠久 Bug。

### 4. 什么是BigInt?

> BigInt是一种新的数据类型，用于当整数值大于Number数据类型支持的范围时。这种数据类型允许我们`安全地对大整数执行算术操作`，表示高分辨率的时间戳，使用`大整数id`，等等，而不需要使用库。

### 5. 为什么需要BigInt?

> 在JS中，所有的`数字都以双精度64位浮点格式`表示，那这会带来什么问题呢？

> 这导致JS中的Number无法精确表示非常大的整数，它会将非常大的整数四舍五入，确切地说，JS中的Number类型只能安全地表示-9007199254740991(-(2^53-1))和9007199254740991（(2^53-1)），任何超出此范围的整数值都可能失去精度。

```js
console.log(9999999999999999);  //=>10000000000000000

复制代码同时也会有一定的安全性问题:

9007199254740992 === 9007199254740993;    // → true 居然是true!

// 复制代码如何创建并使用BigInt？
// 要创建BigInt，只需要在数字末尾追加n即可。
console.log( 9007199254740995n );    // → 9007199254740995n	
console.log( 9007199254740995 );     // → 9007199254740996
复制代码另一种创建BigInt的方法是用BigInt()构造函数、
BigInt("9007199254740995");    // → 9007199254740995n
复制代码简单使用如下:
10n + 20n;    // → 30n	
10n - 20n;    // → -10n	
+10n;         // → TypeError: Cannot convert a BigInt value to a number	
-10n;         // → -10n	
10n * 20n;    // → 200n	
20n / 10n;    // → 2n	
23n % 10n;    // → 3n	
10n ** 3n;    // → 1000n	

const x = 10n;	
++x;          // → 11n	
--x;          // → 9n
console.log(typeof x);   //"bigint"
```

BigInt不支持一元加号运算符, 这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js代码。


因为隐式类型转换可能丢失信息，所以不允许在bigint和 Number 之间进行混合操作。当混合使用大整数和浮点数时，结果值可能无法由BigInt或Number精确表示。

```js
10 + 10n;    // → TypeError
```

不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。
```js
Math.max(2n, 4n, 6n);    // → TypeError
```

当 Boolean 类型与 BigInt 类型相遇时，BigInt的处理方式与Number类似，换句话说，只要不是0n，BigInt就被视为truthy的值。

```js
if(0n){//条件判断为false

}
if(3n){//条件为true

}
```

元素都为BigInt的数组可以进行sort。


BigInt可以正常地进行位运算，如|、&、<<、>>和^

其实现在的兼容性并不怎么好，只有chrome67、firefox、Opera这些主流实现，要正式成为规范，其实还有很长的路要走。
我们期待BigInt的光明前途！


## 02：JS数据类型——检测

### 1. typeof 是否能正确判断类型？

对于`原始类型`来说，除了 null 都可以调用typeof显示正确的类型。

```js
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof x;   //"bigint"
```

对于引用数据类型，除了`函数`以及`console.log`之外，都会显示"object"

```js
typeof [] // 'object'
typeof {} // 'object'
typeof console.log // 'function'
```

typeof 判断对象数据类型是不合适的，采用 `instanceof` 会更好，instanceof的原理是基于原型链的查询，只要处于原型链中，判断永远为true

```js
const Person = function() {}
const p1 = new Person()
p1 instanceof Person // true

var str1 = 'hello world'
str1 instanceof String // false

var str2 = new String('hello world')
str2 instanceof String // true
```

### 2. instanceof 能否判断基本数据类型？

可以
```js
class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(111 instanceof PrimitiveNumber) // true
```

### 3. 还有什么方法可以检测对象的类型呢？那就是 Object.prototype.toString.call(obj)
```js
console.log(Object.prototype.toString.call("jerry"));//[object String]
console.log(Object.prototype.toString.call(12));//[object Number]
console.log(Object.prototype.toString.call(true));//[object Boolean]
console.log(Object.prototype.toString.call(undefined));//[object Undefined]
console.log(Object.prototype.toString.call(null));//[object Null]
console.log(Object.prototype.toString.call({name: "jerry"}));//[object Object]
console.log(Object.prototype.toString.call(function(){}));//[object Function]
console.log(Object.prototype.toString.call([]));//[object Array]
console.log(Object.prototype.toString.call(new Date));//[object Date]
console.log(Object.prototype.toString.call(/\d/));//[object RegExp]
function Person(){};
console.log(Object.prototype.toString.call(new Person));//[object Object]
```

## 03：JS数据类型——转换

### 1. '1'.toString()为什么可以调用？
```js
var s = new String('1');
s.toString();
s = null;
```
第一步: 创建String类实例。
第二步: 调用实例方法。
第三步: 执行完方法立即销毁这个实例。

整个过程体现了`基本包装类型`的性质，而`基本包装类型恰恰属于基本数据类型`，包括Boolean, Number和String。

### 2. Object.is和===的区别？
```js
Object.is(+0,-0) // false
Object.is(NaN,NaN) // true

```
Object在严格等于的基础上修复了一些特殊情况下的失误，具体来说就是+0和-0，NaN和NaN。 源码如下：

```js
function is(x, y) {
  if (x === y) {
    //运行到1/x === 1/y的时候x和y都为0，但是1/+0 = +Infinity， 1/-0 = -Infinity, 是不一样的
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    //NaN===NaN是false,这是不对的，我们在这里做一个拦截，x !== x，那么一定是 NaN, y 同理
    //两个都是NaN的时候返回true
    return x !== x && y !== y;
  }
```

### 3. [] == ![]结果是什么？为什么？

== 中，左右两边都需要转换为数字然后进行比较。
* []转换为数字为0。
* ![] 首先是转换为`布尔值`，由于 [] 作为一个引用类型转换为布尔值为true,
  

因此![]为false，进而在转换成`数字`，变为0。
0 == 0 ， 结果为true


### 4. JS中类型转换有哪几种？
JS中，类型转换只有三种：

* 转换成数字
* 转换成布尔值
* 转换成字符串

下图要牢记于心：
![image](https://user-gold-cdn.xitu.io/2019/10/20/16de9512eaf1158a?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 5. == 和 ===有什么区别？


===叫做严格相等。左右两边不仅值要相等，类型也要相等，例如`'1'===1`的结果是false，因为一边是string，另一边是number。
==不像===那样严格，对于一般情况，只要值相等，就返回true，但==还涉及一些类型转换，它的转换规则如下：

* 两边的类型是否相同，相同的话就比较值的大小，例如1==2，返回false
* 判断的是否是null和undefined，是的话就返回true
* 判断的类型是否是String和Number，是的话，把String类型转换成Number，再进行比较
* 判断其中一方是否是Boolean，是的话就把Boolean转换成Number，再进行比较
* 如果其中一方为Object，且另一方为String、Number或者Symbol，会将Object转换成字符串，再进行比较

```js
console.log({a: 1} == true);//false
console.log({a: 1} == "[object Object]");//true
```

### 6. 对象转原始类型是根据什么流程运行的？

对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：

* 如果Symbol.toPrimitive()方法，优先调用再返回
* 调用valueOf()，如果转换为原始类型，则返回
* 调用toString()，如果转换为原始类型，则返回
* 如果都没有返回原始类型，会报错。

```js
var obj = {
  value: 3,
  valueOf() {
    return 4;
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  }
}
console.log(obj + 1); // 输出7
```

### 7：如何让if(a == 1 && a == 2)条件成立？
其实就是上一个问题的应用。

```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2);//true
```

## 04: 谈谈你对闭包的理解

### 1. 什么是闭包？

> 红宝书(p178)上对于闭包的定义：`闭包是指有权访问另外一个函数作用域中的变量的函数`

> MDN 对闭包的定义为：`闭包是指那些能够访问自由变量的函数`。
（其中自由变量，指在函数中使用的，但既不是函数参数arguments也不是函数的局部变量的变量，其实就是另外一个函数作用域中的变量。）

### 2. 闭包产生的原因？
`作用域链`，在ES5中只存在两种作用域————全局作用域和函数作用域，当访问一个变量时，解释器会首先在当前作用域查找标示符，如果没有找到，就去父作用域找，直到找到该变量的标示符或者不在父作用域中，这就是作用域链，值得注意的是，每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。 比如:

```js
var a = 1;
function f1() {
  var a = 2
  function f2() {
    var a = 3;
    console.log(a);//3
  }
}
```

在这段代码中，f1的作用域指向有全局作用域(window)和它本身，而f2的作用域指向全局作用域(window)、f1和它本身。而且作用域是从最底层向上找，直到找到全局作用域window为止，如果全局还没有的话就会报错。

`闭包的本质`，`当前环境中存在指向父级作用域的引用`。

x会拿到父级作用域中的变量，输出2。因为在当前环境中，含有对f2的引用，f2恰恰引用了window、f1和f2的作用域。因此f2可以访问到f1的作用域的变量。

闭包的本质，我们只需要让`父级作用域的引用存在`即可.

```js
var f3;
function f1() {
  var a = 2
  f3 = function() {
    console.log(a);
  }
}
f1();
f3();
```

f1执行，给f3赋值后，等于说现在f3拥有了window、f1和f3本身这几个作用域的访问权限，还是自底向上查找，最近是在f1中找到了a,因此输出2。

在这里是外面的变量f3存在着父级作用域的引用，因此产生了闭包，形式变了，本质没有改变。

### 3. 闭包有哪些表现形式?

明白本质之后，我们就来看看，在真实的场景中，究竟在哪些地方能体现闭包的存在？
* 返回一个函数。刚刚已经举例。
* 作为函数参数传递

```js
var a = 1;
function foo(){
  var a = 2;
  function baz(){
    console.log(a);
  }
  bar(baz);
}
function bar(fn){
  // 这就是闭包
  fn();
}
// 输出2，而不是1
foo();
```
* 在定时器、事件监听、Ajax请求、跨窗口通信、Web Workers或者任何异步中，只要使用了回调函数，实际上就是在使用闭包。

```js
// 定时器
setTimeout(function timeHandler(){
  console.log('111');
}，100)

// 事件监听
$('#app').click(function(){
  console.log('DOM Listener');
})
```

* IIFE(立即执行函数表达式)创建闭包, 保存了全局作用域window和当前函数的作用域，因此可以全局的变量。

```js
var a = 2;
(function IIFE(){
  // 输出2
  console.log(a);
})();
```

### 4. 解决下面的循环输出问题？
```js
for(var i = 1; i <= 5; i ++){
  setTimeout(function timer(){
    console.log(i)
  }, 0)
}
```

为什么会全部输出6？如何改进，让它输出1，2，3，4，5？(方法越多越好)

> setTimeout为宏任务，由于JS中单线程eventLoop机制，在主线程同步任务执行完后才去执行宏任务，因此循环结束后setTimeout中的回调才依次执行，但输出i的时候当前作用域没有，往上一级再找，发现了i,此时循环已经结束，i变成了6。因此会全部输出6。

解决方法：

1、利用IIFE(立即执行函数表达式)当每次for循环时，把此时的i变量传递到定时器中

```js
for(var i = 1;i <= 5;i++){
  (function(j){
    setTimeout(function timer(){
      console.log(j)
    }, 0)
  })(i)
}
```

2、给定时器传入第三个参数, 作为timer函数的第一个函数参数

```js
for(var i=1;i<=5;i++){
  setTimeout(function timer(j){
    console.log(j)
  }, 0, i)
}
```

3、使用ES6中的let

```js
for(let i = 1; i <= 5; i++){
  setTimeout(function timer(){
    console.log(i)
  },0)
}
```
let使JS发生革命性的变化，让JS有函数作用域变为了块级作用域，用let后作用域链不复存在。代码的作用域以块级为单位，以上面代码为例:

```js
// i = 1
{
  setTimeout(function timer(){
    console.log(1)
  },0)
}
// i = 2
{
  setTimeout(function timer(){
    console.log(2)
  },0)
}
// i = 3
...
```
因此能输出正确的结果。

## 05：new 的过程

* 1.新生成了一个对象
* 2.链接到原型
* 3.绑定 this
* 4.返回新对象

new 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 new

```js
function create() {
  // 1. 创建一个空对象
  let obj = new Object();
  // 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
  let Con = [].shift.call(arguments);
  // 2. 链接到原型
  obj.__proto__ = Con.prototype;
  // 3. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  let result = Con.apply(obj,arguments);
  // 4.确保 new 出来是一个对象
  return typeof result === 'object' ? result : obj;
}
```

## 06：this

JS中的this是一个非常简单的东西，只需要理解它的执行规则就OK。
场景讨论:

1. 全局上下文
2. 直接调用函数
3. 对象.方法的形式调用
4. DOM事件绑定(特殊)
5. new构造函数绑定
6. 箭头函数
7. call/apply/bind可以显示绑定

### 1. 全局上下文
全局上下文默认this指向window, 严格模式下指向undefined。

### 2. 直接调用函数
这种情况是直接调用。this相当于全局上下文的情况.
```js
let obj = {
  a: function() {
    console.log(this);
  }
}
let func = obj.a;
func();
```
### 3. 对象.方法的形式调用
还是刚刚的例子，如果这样写:
```js
obj.a();
```
这就是对象.方法的情况，this指向这个对象

### 4. DOM事件绑定
onclick和addEventerListener中 this 默认指向绑定事件的元素。

IE比较奇异，使用attachEvent，里面的this默认指向window

### 5. new+构造函数
此时构造函数中的this指向实例对象。

### 6. 箭头函数
箭头函数没有this, 因此也不能绑定。里面的this会指向当前最近的非箭头函数的this，找不到就是window(严格模式是undefined)。比如:

```js
let obj = {
  a: function() {
    let do = () => {
      console.log(this);
    }
    do();
  }
}
obj.a(); // 找到最近的非箭头函数a，a现在绑定着obj, 因此箭头函数中的this是obj.   this 一旦绑定了上下文，就不会被任何代码改变。
```
优先级: new > call、apply、bind > 对象.方法 > 直接调用。

## 06: 深浅拷贝

```js
let a = {
    age: 1
}
let b = a
a.age = 2
console.log(b.age) // 2
```

如果给一个变量赋值一个对象，那么两者的值会是同一个引用，其中一方改变，另一方也会相应改变。

通常在开发中我们不希望出现这样的问题，我们可以使用浅拷贝来解决这个问题。

### 浅拷贝

* 1. 通过 Object.assign 来解决这个问题。

```js
let a = {
    age: 1
}
let b = Object.assign({}, a)
a.age = 2
console.log(b.age) // 1
```

* 2. 也可以通过展开运算符（…）来解决
```js
let a = {
    age: 1
}
let b = {...a}
a.age = 2
console.log(b.age) // 1
```
```js
let a = {
    age: 1,
    jobs: {
        first: 'FE'
    }
}
let b = {...a}
a.jobs.first = 'native'
console.log(b.jobs.first) // native
```
浅拷贝只解决了第一层的问题，如果接下去的值中还有对象的话，那么就又回到刚开始的话题了，两者享有相同的引用。要解决这个问题，我们需要引入深拷贝.

### 深拷贝
`JSON.parse(JSON.stringify(object))`可解决但有局限性

```js
let a = {
  age: 1,
  jobs: {
    first: 'FE'
  }
}
let b = JSON.parse(JSON.stringify(a))
a.jobs.first = 'native'
console.log(b.jobs.first) //FE
```
局限性有：
* 忽略 `undefined`
* 忽略 `symbol`
* 不能序列化函数
* 不能解决循环引用问题

```js
let a = {
    age: undefined,
    sex: Symbol('male'),
    jobs: function() {},
    name: 'lkt'
}
let b = JSON.parse(JSON.stringify(a))
console.log(b) // {name: "lkt"}
```

> 但是在通常情况下，复杂数据都是可以序列化的，所以这个函数可以解决大部分问题，并且该函数是内置函数中处理深拷贝性能最快的。当然如果数据中含有以上三种情况下，可以使用 `lodash 的深拷贝函数`

## 07：模块化

### ES6
在有 Babel 的情况下，我们可以直接使用 ES6 的模块化
```js
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function() {}

import {a, b} from './a.js'
import XXX from './b.js'
```

### CommonJs
CommonJs 是 Node 独有的规范，浏览器中使用就需要用到 Browserify 解析了。

```js
// a.js
module.exports = {
    a: 1
}
// or
exports.a = 1

// b.js
var module = require('./a.js')
module.a // -> log 1
```
在上述代码中，module.exports 和 exports 很容易混淆，让我们来看看大致内部实现

```js
var module = require('./a.js')
module.a
// 这里其实就是包装了一层立即执行函数，这样就不会污染全局变量了，
// 重要的是 module 这里，module 是 Node 独有的一个变量
module.exports = {
    a: 1
}
// 基本实现
var module = {
  exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function (module) {
    // 导出的东西
    var a = 1
    module.exports = a
    return module.exports
};
```
再来说说 module.exports 和 exports，用法其实是相似的，但是不能对 exports 直接赋值，不会有任何效果。

对于 `CommonJS` 和 `ES6` 中的模块化的两者区别是：

* 前者支持动态导入，也就是 require(${path}/xx.js)，后者目前不支持，但是已有提案

* 前者是同步导入，因为用于服务端，文件都在本地，同步导入即使卡住主线程影响也不大。而后者是异步导入，因为用于浏览器，需要下载文件，如果也采用同步导入会对渲染有很大影响

* 前者在导出时都是值拷贝，就算导出的值变了，导入的值也不会改变，所以如果想更新值，必须重新导入一次。但是后者采用实时绑定的方式，导入的是一个地址，导入导出的值都指向同一个内存地址，所以导入值会跟随导出值变化

* 后者会编译成 require/exports 来执行的


## 08：call, apply, bind 区别？


call 和 apply 都是为了解决改变 this 的指向。作用都是相同的，只是传参的方式不同。

除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。

```js
let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
getValue.call(a, 'lkt', '22')
getValue.apply(a, ['lkt', '22'])
```

bind 和 call 很相似，第一个参数是this的指向，从第二个参数开始是接收的参数列表。
区别在于bind方法返回值是函数以及bind接收的参数列表的使用。

```js
var obj = {
    name: 'lkt'
}

function printName() {
    console.log(this.name)
}

var des = printName.bind(obj)
console.log(dot) // function () { … }
des()  // lkt
```


## 09：原型

### 1. 原型对象和构造函数的关系？

* 在JavaScript中，每当定义一个函数数据类型（普通函数、类）时候，都会自带一个`prototype`属性，这个属性指向函数的原型对象`contrustor`.
* 当函数经过new调用时，这个函数就变成了构造函数，返回一个全新的实例对象，这个实例对象有一个`__proto__`属性，指向构造函数的原型对象`contrustor`。

![](https://s1.ax1x.com/2020/07/12/U8a6xA.png)

### 2.能不能描述一下原型链？
JavaScript对象通过prototype指向父类对象，直到指向Object对象为止，这样就形成了一个原型指向的链条, 即原型链。

![](https://s1.ax1x.com/2020/07/12/U8dlLt.png)

* 对象的`hasOwnProperty()`来检查对象自身中是否含有该属性
* 使用 `in` 检查对象中是否含有某个属性时，如果对象中没有但是原型链中有，也会返回 true