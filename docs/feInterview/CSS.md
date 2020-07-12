## 01: 元素水平居中，垂直居中?

### 水平居中
* 对于行内元素
    * 给父元素设置： `text-align: center;`
    * flex布局，给父元素使用：`display:flex;justify-content:center;`


* 对于块级元素
  * 对于确定宽度的块级元素：

      * 给子元素width和margin实现。margin: 0 auto;

  * 对于宽度未知的块级元素
      * table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为display:table），再通过给该标签添加左右margin为auto。

      * inline-block实现水平居中方法。父元素display：inline-block和 子元素text-align:center实现水平居中。

      * 父元素 transform，translateX可以移动本身元素的50%。

      * flex布局使用justify-content:center

### 垂直居中

* 利用line-height实现居中，这种方法适合纯文字类

* 通过设置父容器相对定位，子级设置绝对定位，标签通过margin实现自适应居中

* 弹性布局flex:父级设置display: flex; justify-content:center; flex 伸缩方向

* 父级设置相对定位，子级设置绝对定位，并且通过位移transform实现

* table布局，父元素通过转换成表格形式 table-cell，然后子元素设置vertical-align实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）。

```css
.father {
  width: 200px;
  height:500px;
  display: table-cell;
  vertical-align: middle;
  background-color: aqua;
}
.son {
  display: table-cell;
  vertical-align:middle;
}
```


## 02: display:inline-block会产生什么问题?如何解决?

问题: 两个display：inline-block元素放到一起会产生一段空白。

如代码:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
      .container {
        width: 800px;
        height: 200px;
      }

      .left {
        font-size: 14px;
        background: red;
        display: inline-block;
        width: 100px;
        height: 100px;
      }

      .right {
        font-size: 14px;
        background: blue;
        display: inline-block;
        width: 100px;
        height: 100px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="left">
        左
      </div>
      <div class="right">
        右
      </div>
    </div>
  </body>
</html>
```
效果如下:

![](https://s1.ax1x.com/2020/06/21/N8DWZQ.png)


> 产生空白的原因: 元素被当成行内元素排版的时候，元素之间的空白符（空格、回车换行等）都会被浏览器处理，根据CSS中white-space属性的处理方式（默认是normal，合并多余空白），原来HTML代码中的回车换行被转成一个空白符，在字体不为0的情况下，空白符占据一定宽度，所以inline-block的元素之间就出现了空隙。

### 解决办法
#### 1. 将子元素标签的结束符和下一个标签的开始符写在同一行或把所有子标签写在同一行
```html
<div class="container">
  <div class="left">
      左
  </div><div class="right">
      右
  </div>
</div>
```
#### 2. 父元素中设置font-size: 0，在子元素上重置正确的font-size
```css
.container{
  width:800px;
  height:200px;
  font-size: 0;
}
```
#### 3. 为子元素设置float:left
```css
.left{
  float: left;
  font-size: 14px;
  background: red;
  display: inline-block;
  width: 100px;
  height: 100px;
}
/* right是同理 */
```


## 03：知道animation-fill-mode吗？

animation-fill-mode 属性规定动画在播放之前或之后，其动画效果是否可见。

| 值 |	描述 |
- | - 
none|	不改变默认行为。
forwards	|当动画完成后，保持最后一个属性值（在最后一个关键帧中定义）。
backwards |	在 animation-delay 所指定的一段时间内，在动画显示之前，应用开始属性值（在第一个关键帧中定义）。
both |	向前和向后填充模式都被应用。

## 04：什么是BFC（边距重叠解决方案）？

### 1. 如何触发BFC？（一个新的BFC可以通过给容器添加任何一个触发BFC的CSS样式来创建）


* float的值不为none
* position的值不为static或者relative
* display的值为 table-cell, table-caption, inline-block, flex, 或者 inline-flex中的其中一个
* overflow的值不为visible


### 2. 关于position定位的值
static定位：static定位是`HTML元素的默认值`，即没有定位，元素出现在正常的流中

fixed固定定位：fixed定位是指元素的位置`相对于浏览器窗口是固定位置`，即使窗口是滚动的它也不会滚动，且fixed定位使元素的位置与文档流无关，因此不占据空间，且它会和其他元素发生重叠。

relative相对定位：

* 相对定位元素的定位是相对它自己的正常位置的定位。
* 即使相对元素的内容移动了，但是预留空间的元素仍然保存在正常流动

absolute绝对定位：

绝对定位的元素相对于最近的已定位父元素，如果元素没有已定位的父元素，那么它的位置相对于\<html\>。

sticky粘性定位
粘性定位是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位。

		
### 3. BFC的约束规则
* 1，BFC内元素垂直方向的边距会发生重叠（当兄弟元素的外边距不一样时，将以最大的那个外边距为准。）
* 2，BFC的区域不会与浮动元素的BOX重叠（清除浮动）
* 3，BFC在页面上是一个容器，外面的元素不会影响到里面的元素
* 4，计算BFC元素高度时，即使是浮动元素也会参与计算
* 5，每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）				