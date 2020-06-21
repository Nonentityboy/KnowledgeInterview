## 01：队列：先入先出的数据结构

我们将首先介绍先入先出（FIFO）及其在队列中的工作方式。

本章的目的是帮助你：

* 理解 FIFO 和队列的定义；
* 能够自己实现队列；
* 熟悉内置队列结构；
* 使用队列来解决简单的问题。

![](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/08/14/screen-shot-2018-05-03-at-151021.png)


 FIFO 数据结构中，将首先处理添加到队列中的第一个元素。

>如上图所示，队列是典型的 FIFO 数据结构。插入（insert）操作也称作入队（enqueue），新元素始终被添加在队列的末尾。 删除（delete）操作也被称为出队（dequeue)。 你只能移除第一个元素。


### 队列 - 实现

为了实现队列，我们可以使用动态数组和指向队列头部的索引。

如上所述，队列应支持两种操作：入队和出队。入队会向队列追加一个新元素，而出队会删除第一个元素。 所以我们需要一个索引来指出起点。

```js
class Queue {
  constructor() {
    this.queue = []
  }
  enQueue(item) {
    this.queue.push(item)
  }
  deQueue() {
    return this.queue.shift()
  }
  getHeader() {
    return this.queue[0]
  }
  getLength() {
    return this.queue.length
  }
  isEmpty() {
    return this.getLength() === 0
  }
}
```