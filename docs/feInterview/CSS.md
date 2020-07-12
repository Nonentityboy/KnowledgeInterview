## 01: 给一个元素水平居中，垂直居中?

### 水平居中
* 对于行内元素
    * 给父元素设置： `text-align: center;`

    * flex布局，给父元素使用：`display:flex;justify-content:center;`

    * 行内元素设置`display: block;`：给子元素width和margin实现。`margin: 0 auto;`


* 对于块级元素
  * 对于确定宽度的块级元素：
      * 给子元素width和margin实现。margin: 0 auto;

  * 对于宽度未知的块级元素
      * table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为display:table），再通过给该标签添加左右margin为auto

      * inline-block实现水平居中方法。父元素`display:inline-block;`和子元素`text-align:center;`实现水平居中

      * 子元素绝对定位、`transform:translateX(50%)`;可以移动本身元素的50%

      * flex布局父元素使用：`display:flex;justify-content:center;`

      * 使用绝对定位, 给子元素：`position:absolute;left:0;right:0;margin:0 auto;`

### 垂直居中

* 利用line-height实现居中，这种方法适合纯文字类

* 通过设置父容器相对定位，子级设置绝对定位，通过margin实现自适应居中

* 弹性布局flex:父级设置`display: flex; justify-content:center;`

*  父元素定宽高。 子元素通过位移`margin-left: 50%;transform: translateX(-50%);`实现

* table布局，父元素通过转换成表格形式 table-cell，然后子元素设置vertical-align实现。（`vertical-align: middle`使用的前提条件是内联元素以及display值为table-cell的元素）。

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

static定位：

* static定位是`HTML元素的默认值`，即没有定位，元素出现在正常的流中

fixed固定定位：

* fixed定位是指元素的位置`相对于浏览器窗口是固定位置`
* 即使窗口是滚动的它也不会滚动
* fixed定位使元素的位置与文档流无关，因此不占据空间，且它会和其他元素发生重叠。

relative相对定位：

* 相对定位元素的定位是`相对它自己的正常位置的定位`。
* 即使相对元素的内容移动了，但是`预留空间的元素仍然保存在正常流动`

absolute绝对定位：
* 绝对定位的元素相对于最近的已定位父元素，如果元素没有已定位的父元素，那么它的位置相对于\<html\>。

sticky粘性定位
* 粘性定位是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位。

inherit：
* 规定应该从父元素继承 position 属性的值。

		
### 3. BFC的约束规则
* 1，BFC内元素垂直方向的边距会发生重叠（当兄弟元素的外边距不一样时，将以最大的那个外边距为准。）
* 2，BFC的区域不会与浮动元素的BOX重叠（清除浮动）
* 3，BFC在页面上是一个容器，外面的元素不会影响到里面的元素
* 4，计算BFC元素高度时，即使是浮动元素也会参与计算
* 5，每个元素的左外边距与包含块的左边界相接触（从左向右），即使浮动元素也是如此。（这说明BFC中子元素不会超出他的包含块，而position为absolute的元素可以超出他的包含块边界）	


## 05：实现一个三角形、梯形、扇形、椭圆？


### 1. 三角形
```html
<style>
.triangle {
  width: 0;
  height: 0;
  border-top: 100px solid #f00;
  border-right: 100px solid #0f0;
  border-bottom: 100px solid #00f;
  border-left: 100px solid #ff0;
  /* 给任意三边的颜色设置为 transparent 即可分别实现任一方向的三角形。 */
   /* border-color: red transparent transparent transparent; */
}
</style>

<div class="triangle"></div>
```

![](https://user-gold-cdn.xitu.io/2020/2/10/1702f5bfe0d2191b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


```html
<style>
    .triangle {
        width: 0;
        height: 0;

        /* 底: border 高:border-bottom */
        border: 100px solid transparent;
        border-bottom: 200px solid #0ff;
    }
</style>
```


![](https://user-gold-cdn.xitu.io/2020/2/10/1702f681ed08ae46?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


### 2. 梯形

```html
<style>
.trapezoid {
    width: 50px;
    height: 50px;
    background: #ff0;
    border-top: 50px solid #f00;
    border-bottom: 50px solid #00f;
    border-left: 50px solid #0f0;
    border-right: 50px solid #0ff;
}
</style>
<div class="trapezoid"></div>
```

![](https://user-gold-cdn.xitu.io/2020/2/11/17031c7e41771496?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![](与三角形同理，把任意三边颜色设置为 transparent即可得到某一朝向的`梯形`。)

### 3. 画扇形

任意角度的有点复杂，暂时先只实现90度的吧。
原理：左上角是圆角，其余三个角都是直角：左上角的值为宽和高一样的值，其他三个角的值不变（等于0）。
border-radius四个值的顺序是：左上角，右上角，右下角，左下角。
```html
<style>
    .sector1 {
        border-radius:100px 0 0;
        width: 100px;
        height: 100px;
        background: #00f;
    }
</style>
<div class="sector1"></div>
```


![](https://user-gold-cdn.xitu.io/2020/2/11/170320c0dea1744c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


原理：和三角形的实现有些类似。
```html
<style>
    .sector2 {
        border: 100px solid transparent;
        width: 0;
        border-radius: 100px;
        border-top-color: #f00;
    }
    
</style>
<div class="sector2"></div>
```
![](https://user-gold-cdn.xitu.io/2020/2/11/170321023cecbadc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


### 4. 椭圆

椭圆依旧依赖 `border-radius` 属性，很多人应该都没注意过，border-radius 其实可以设置水平半径和垂直半径两个值, 具体用法为 `border-radius: 水平半径 / 垂直半径;`.
```html
<style>
.oval {
    width: 100px;
    height: 50px;
    background: #ff0;
    border-radius: 50px / 25px;
}
</style>
<div class="oval"></div>

```

![](https://user-gold-cdn.xitu.io/2020/2/11/17031cff09439a3d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 06：box-sizing有哪些属性？

### box-sizing: content-box | border-box | inherit;
content-box:
```
默认值，标准盒子模型。 
width 与 height 只包括内容的宽和高，不包括边框（border），内边距（padding），外边距（margin）。
注意: 内边距, 边框 & 外边距 都在这个盒子的外部。 
比如: 如果 .box {width: 350px}; 而且 {border: 10px solid black;} 那么在浏览器中的渲染的实际宽度将是370px;


尺寸计算公式：
width = 内容的宽度，height = 内容的高度。
元素的宽度和元素的高度都不包含内容的边框（border）和内边距（padding）。
```

border-box:
```
width 和 height 属性包括内容，内边距和边框，但不包括外边距。
这是当文档处于Quirks模式时Internet Explorer使用的盒模型。
注意: 填充和边框将在盒子内。
比如: .box {width: 350px; border: 10px solid black;} 导致在浏览器中呈现的宽度为350px的盒子。
内容框不能为负，最少被分配到0，使得不可能使用border-box使元素消失。

这里的维度计算为：
width = border + padding + 内容的width，
height = border + padding + 内容的height。
```

## 07：一个高度自适应的div，里面有两个div，一个高度100px，希望另一个填满剩下的高度

````html
<style>
body { height: 100%; padding: 0; margin: 0; }

/*方案一*/
/*.outer { height: 100%; padding: 100px 0 0; box-sizing: border-box ; }
.A { height: 100px; margin: -100px 0 0; background: #BBE8F2; }
.B { height: 100%; background: #D9C666; }*/

/*方案二*/
.outer { height: 100%; position: relative; }
.A { height: 100px; background: #BBE8F2; }
.B { background: #D9C666; width: 100%; position: absolute; top: 100px ; left: 0 ; bottom: 0; }
</style>        
</head>          
<body>  
    <div class="outer">
        <div class="A"></div>
        <div class="B"></div>
    </div>
</body>
```   