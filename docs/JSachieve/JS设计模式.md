## 单例模式

> 单例模式的定义：保证一个类仅有一个实例，并提供一个访问它的全局访问点。实现的方法为先判断实例存在与否，如果存在则直接返回，如果不存在就创建了再返回，这就确保了一个类只有一个实例对象。

> 适用场景：一个单一对象。比如：弹窗，无论点击多少次，弹窗只应该被创建一次。

```js
const singleton = function(name) {
  this.name = name
  this.instance = null
}

singleton.prototype.getName = function() {
  console.log(this.name)
}

singleton.getInstance = function(name) {
  if (!this.instance) { // 关键语句
    this.instance = new singleton(name)
  }
  return this.instance
}

// test
const a = singleton.getInstance('a') // 通过 getInstance 来获取实例
const b = singleton.getInstance('b')
console.log(a === b)
```


## 观察者模式(订阅/发布模式)

观察者模式包含两种角色：

* 观察者（订阅者）
* 被观察者（发布者）

> 核心思想：观察者只要`订阅了被观察者的事件`，那么当被观察者的状态改变时，被观察者会主动去通知观察者，而无需关心观察者得到事件后要去做什么，实际程序中可能是`执行订阅者的回调函数`。

现实生活中的发布-订阅模式；

小红最近在淘宝网上看上一双鞋子，但是呢，联系到卖家后，才发现这双鞋卖光了，但是小红对这双鞋又非常喜欢，所以呢联系卖家，问卖家什么时候有货，卖家告诉她，要等一个星期后才有货，卖家告诉小红，要是你喜欢的话，你可以收藏我们的店铺，等有货的时候再通知你，所以小红收藏了此店铺，但与此同时，小明，小花等也喜欢这双鞋，也收藏了该店铺；等来货的时候就依次会通知他们；

* 卖家是属于发布者，
* 小红，小明等属于订阅者，订阅该店铺