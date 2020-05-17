## 01: JS数组的高阶函数——基础

### 1.什么是高阶函数 
概念：`一个函数`可以接收另一个函数作为参数或返回值为一个函数，`这种函数` 就称之为高阶函数。

### 2.数组中的高阶函数

#### 1.map
* 参数：接受两个参数，一个是回调函数，一个是回调函数的this值(可选)。
其中，回调函数默认传入三个值，依次为当前元素、当前索引、整个数组。
* 创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
* 对原来的数组没有影响

```js
let nums = [1,2,3];
let obj = {value: 5};

let newNums = nums.map(function(item,index,nums){
    return item + index + nums[index] + this.value;
    //对第一个元素，1 + 0 + 1 + 5 = 7
    //对第二个元素，2 + 1 + 2 + 5 = 10
    //对第三个元素，3 + 2 + 3 + 5 = 13
},obj)//[7, 10, 13]
```
后面的参数是可选的，可以省略


#### 2.reduce
* 参数: 接收两个参数，一个为回调函数，另一个为初始值。回调函数中三个默认参数，依次为积累值、当前值、整个数组。
```js
let nums = [1, 2, 3];
// 多个数的加和
let newNums = nums.reduce(function(preSum,curVal,array) {
  return preSum + curVal; 
}, 0);
console.log(newNums);//6
```
* 不传默认值会怎样？

* 不传默认值会自动以第一个元素为初始值，然后从第二个元素开始依次累计。

#### 3.filter
* 参数: 一个函数参数。这个函数接受一个默认参数，就是当前元素。这个作为参数的函数返回值为一个布尔类型，决定元素是否保留。

filter方法返回值为一个新的数组，这个数组里面包含参数里面所有被保留的项。

```js
let nums = [1, 2, 3];
// 保留奇数项
let oddNums = nums.filter(item => item % 2);
console.log(oddNums);
```

#### 4. sort
参数: 一个用于比较的函数，它有两个默认参数，分别是代表比较的两个元素。

举个例子:

```js
let nums = [2, 3, 1];
//两个比较的元素分别为a, b
nums.sort(function(a, b) {
  if(a > b) return 1;
  else if(a < b) return -1;
  else if(a == b) return 0;
})
```
当比较函数返回值大于0，则 a 在 b 的后面，即a的下标应该比b大。

反之，则 a 在 b 的后面，即 a 的下标比 b 小。

整个过程就完成了一次升序的排列。

当然还有一个需要注意的情况，就是比较函数不传的时候，是如何进行排序的？

>答案是将数字转换为字符串，然后根据字母unicode值进行升序排序，也就是根据字符串的比较规则进行升序排序。

## 02: forEach中return有效果吗？如何中断forEach循环？

在forEach中用return不会返回，函数会继续执行。

```js
let nums = [1, 2, 3];
nums.forEach((item, index) => {
  return;//无效
})
```
中断方法：

使用try监视代码块，在需要中断的地方抛出异常。

> 官方推荐方法（替换方法）：用every和some替代forEach函数。every在碰到return false的时候，中止循环。some在碰到return ture的时候，中止循环

## 03: JS判断数组中是否包含某个值

### 方法一：array.indexOf
此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。
```js
var arr=[1,2,3,4];
var index=arr.indexOf(3);
console.log(index);
```
### 方法二：array.includes(searcElement[,fromIndex])

此方法判断数组中是否存在某个值，如果存在返回true，否则返回false
```js
var arr=[1,2,3,4];
if(arr.includes(3))
    console.log("存在");
else
    console.log("不存在");
```
### 方法三：array.find(callback[,thisArg])
返回数组中满足条件的第一个元素的值，如果没有，返回undefined
```js
var arr=[1,2,3,4];
var result = arr.find(item =>{
    return item > 3
});
console.log(result);
```
### 方法四：array.findeIndex(callback[,thisArg])
返回数组中满足条件的第一个元素的下标，如果没有找到，返回-1
```js
var arr=[1,2,3,4];
var result = arr.findIndex(item =>{
    return item > 3
});
console.log(result);
```
当然，for循环当然是没有问题的，这里讨论的是数组方法，就不再展开了。

## 04: JS中flat---数组扁平化 

对于前端项目开发过程中，偶尔会出现层叠数据结构的数组，我们需要将多层级数组转化为一级数组（即提取嵌套数组元素最终合并为一个数组），使其内容合并且展开。那么该如何去实现呢？

需求:多维数组=>一维数组
```js
let ary = [1, [2, [3, [4, 5]]], 6];// -> [1, 2, 3, 4, 5, 6]
let str = JSON.stringify(ary);
```

### 1. 调用ES6中的flat方法
```js
ary = arr.flat(Infinity);
```
### 2. replace + split

```js
ary = str.replace(/(\[|\])/g, '').split(',')
```
### 3. replace + JSON.parse
```js
str = str.replace(/(\[|\]))/g, '');
str = '[' + str + ']';
ary = JSON.parse(str);
```

### 4. 普通递归

```js
let result = [];
let fn = function(ary) {
  for(let i = 0; i < ary.length; i++) {
    let item = ary[i];
    if (Array.isArray(ary[i])){
      fn(item);
    } else {
      result.push(item);
    }
  }
}
```
### 5. 利用reduce函数迭代

```js
function flatten(ary) {
    return ary.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
}
let ary = [1, 2, [3, 4], [5, [6, 7]]]
console.log(flatten(ary))
```
### 6：扩展运算符

```js
//只要有一个元素有数组，那么循环继续
while (ary.some(Array.isArray())) {
  ary = [].concat(...ary);
}
```
### 7: 利用Set 数据结构

扩展运算符(...)内部使用for...of循环
```js
let arr = [3,5,2,2,5,5];
let unique = [...new Set(arr)]; // [3,5,2]
```
利用Array.from将Set结构转为数组
```js
function dedupe(array){
  return Array.from(new Set(arr));
}
dedupe([1,1,2,3])// [1,2,3]
```

### 8：利用indexOf()与for循环

```js
let arr = ['abc', 'abc','ss','a','d',1,4,1]
function distinct(arr){
  let newArr = [];
  let arrLength = arr.length;
  for(let i = 0; i < arrLength; i++){
    if(newArr.indexOf(arr[i]) === -1){
      newArr.push(arr[i]);
    }
  }
  return newArr;
}
console.log(distinct(arr));
```