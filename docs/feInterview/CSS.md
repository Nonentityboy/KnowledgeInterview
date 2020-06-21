## 01: 元素水平居中,垂直居中?

### 水平居中
* 对于行内元素: `text-align: center;`

* 对于确定宽度的块级元素：

    * width和margin实现。margin: 0 auto;

    * 绝对定位和margin-left: -width/2, 前提是父元素position: relative

* 对于宽度未知的块级元素
    * table标签配合margin左右auto实现水平居中。使用table标签（或直接将块级元素设值为display:table），再通过给该标签添加左右margin为auto。

    * inline-block实现水平居中方法。display：inline-block和 text-align:center实现水平居中。

    * 绝对定位+transform，translateX可以移动本身元素的50%。

    * flex布局使用justify-content:center

### 垂直居中

* 利用line-height实现居中，这种方法适合纯文字类

* 通过设置父容器相对定位，子级设置绝对定位，标签通过margin实现自适应居中

* 弹性布局flex:父级设置display: flex; 子级设置margin为auto实现自适应居中

* 父级设置相对定位，子级设置绝对定位，并且通过位移transform实现

* table布局，父级通过转换成表格形式，然后子级设置vertical-align实现。（需要注意的是：vertical-align: middle使用的前提条件是内联元素以及display值为table-cell的元素）。


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
