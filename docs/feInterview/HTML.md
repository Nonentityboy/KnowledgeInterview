## 01: HTML5和HTML4的不同?
### 声明方面
HTML5 文件类型声明（<!DOCTYPE>）变成下面的形式：
```html
<!DOCTYPE html>
```
### 标准方面
HTML5的文档解析不再基于SGML(Standard Generalized Markup Language)标准，而是形成了自己的一套标准。
### 标签方面
新增语义标签，其中包括
```html
<header>、<footer>、<section>、<article>、<nav>、<hgroup>、<aside>、<figure>
```
废除一些网页美化方面的标签，使样式与结构分离更加彻底, 包括
```js
<big>、<u>、<font>、<basefont>、<center>、<s>、<tt>
```
通过增加了<audio>、<video>两个标签来实现对多媒体中的音频、视频使用的支持。
### 属性方面

```html
增加了一些表单属性, 主要是其中的input属性的增强
<!-- 此类型要求输入格式正确的email地址 -->
<input type=email >
<!-- 要求输入格式正确的URL地址  -->
<input type=url >
<!-- 要求输入格式数字，默认会有上下两个按钮 -->
<input type=number >
<!-- 时间系列，但目前只有 Opera和Chrome支持 -->
<input type=date >
<input type=time >
<input type=datetime >
<input type=datetime-local >
<input type=month >
<input type=week >
<!-- 默认占位文字 -->
<input type=text placeholder="your message" >
<!-- 默认聚焦属性 -->
<input type=text autofacus="true" >
其他标签新增了一些属性,
<!-- meta标签增加charset属性 -->
<meta charset="utf-8">
<!-- script标签增加async属性 -->
<script async></script>
使部分属性名默认具有boolean属性
<!-- 只写属性名默认为true -->
<input type="checkbox"  checked/>
<!-- 属性名="属性名"也为true -->
<input type="checkbox"  checked="checked"/>
```
### 存储方面
* 新增WebStorage, 包括localStorage和sessionStorage

* 引入了IndexedDB和Web SQL，允许在浏览器端创建数据库表并存储数据, 两者的区别在于IndexedDB更像是一个NoSQL数据库，而WebSQL更像是关系型数据库。W3C已经不再支持WebSQL。

* 引入了应用程序缓存器(application cache)，可对web进行缓存，在没有网络的情况下使用，通过创建cache manifest文件,创建应用缓存，为PWA(Progressive Web App)提供了底层的技术支持。
## 02: meta标签属性有哪些?

### charset属性
```html
<!-- 定义网页文档的字符集 -->
<meta charset="utf-8" />
```
### name + content属性

```html
<!-- 网页作者 -->
<meta name="author" content="开源技术团队"/>
<!-- 网页地址 -->
<meta name="website" content="https://sanyuan0704.github.io/frontend_daily_question/"/>
<!-- 网页版权信息 -->
 <meta name="copyright" content="2018-2019 demo.com"/>
<!-- 网页关键字, 用于SEO -->
<meta name="keywords" content="meta,html"/>
<!-- 网页描述 -->
<meta name="description" content="网页描述"/>
<!-- 搜索引擎索引方式，一般为all，不用深究 -->
<meta name="robots" content="all" />
<!-- 移动端常用视口设置 -->
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0, user-scalable=no"/>
<!-- 
  viewport参数详解：
  width：宽度（数值 / device-width）（默认为980 像素）
  height：高度（数值 / device-height）
  initial-scale：初始的缩放比例 （范围从>0 到10）
  minimum-scale：允许用户缩放到的最小比例
  maximum-scale：允许用户缩放到的最大比例
  user-scalable：用户是否可以手动缩 (no,yes)
 -->
```
### http-equiv属性
```html
<!-- expires指定网页的过期时间。一旦网页过期，必须从服务器上下载。 -->
<meta http-equiv="expires" content="Fri, 12 Jan 2020 18:18:18 GMT"/>
<!-- 等待一定的时间刷新或跳转到其他url。下面1表示1秒 -->
<meta http-equiv="refresh" content="1; url=https://www.baidu.com"/>
<!-- 禁止浏览器从本地缓存中读取网页，即浏览器一旦离开网页在无法连接网络的情况下就无法访问到页面。 -->
<meta http-equiv="pragma" content="no-cache"/>
<!-- 也是设置cookie的一种方式，并且可以指定过期时间 -->
<meta http-equiv="set-cookie" content="name=value expires=Fri, 12 Jan 2001 18:18:18 GMT,path=/"/>
<!-- 使用浏览器版本 -->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<!-- 针对WebApp全屏模式，隐藏状态栏/设置状态栏颜色，content的值为default | black | black-translucent -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```
## 03: src与href区别?

### 定义
href是Hypertext Reference的简写，表示超文本引用，指向网络资源所在位置。

常见场景:
```html
<a href="http://www.baidu.com"></a> 
<link type="text/css" rel="stylesheet" href="common.css"> 
```
src是source的简写，目的是要把文件下载到html页面中去。

常见场景:
```html
<img src="img/girl.jpg"></img> 
<iframe src="top.html"> 
<script src="show.js"> 
```
### 作用结果
href 用于在当前文档和引用资源之间确立联系
src 用于替换当前内容
### 浏览器解析方式
* 当浏览器遇到href会并行下载资源并且不会停止对当前文档的处理。(同时也是为什么建议使用 link 方式加载 CSS，而不是使用 @import 方式)
* 当浏览器解析到src ，会暂停其他资源的下载和处理，直到将该资源加载或执行完毕。(这也是script标签为什么放在底部而不是头部的原因)
## 04: Web语义化?


### 什么是SEO？
SEO（Search Engine Optimization，搜索引擎优化 ），是一种利用搜索引擎的搜索规则来提高目的网站在有关搜索引擎内的排名的方式。通俗来讲就是根据搜素引擎的规则来优化你的网站，让你的网站能够在用户的搜索结果中排在前面，提高网站的访问量。

### SEO常用方式
* 采用DIV+CSS布局
采用div-css布局的网站对于搜索引擎很是友好，因此其避免了Table嵌套层次过多而无法被搜索引擎抓取的问题，而且简洁、结构化的代码更加有利于突出重点和适合搜索引擎抓取。

* 尽量不使用表格布局，因为搜索引擎对表格布局嵌套3层以上的内容懒的去抓取。

TDK优化
TDK，即 title, description, keywords。

### 一、title

在SEO中，标题的优化占着举足轻重的地位，无论是从用户体验的角度出发，还是从搜索引擎的排名效果出发，title都是页面优化最最重要的因素。
title的分隔符一般有,，_，-和空格。其中_对百度比较友好，而-对谷歌比较友好，空格在英文站点可以使用但中文少用。

推荐做法：

* 每个网页应该有一个独一无二的标题，切忌所有的页面都使用同样的默认标题
* 标题要主题明确，包含这个网页中最重要的内容
* 简明精练，不罗列与网页内容不相关的信息
* 如果你的文章标题不是很长，还可以加入点关键词进去，如文章title_关键词_网站名称
* 用户浏览通常是从左到右的，重要的内容应该放到title的靠前的位置
* 使用用户所熟知的语言描述。如果你有中、英文两种网站名称，尽量使用用户熟知的那一种做为标题描述

示例：

```html
<title>阿里巴巴1688.com - 全球领先的采购批发平台,批发网</title>
<title>京东(JD.COM)-正品低价、品质保障、配送及时、轻松购物！</title>
```

### 二、description

description不是权值计算的参考因素，这个标签存在与否不影响网页权值，只会用做搜索结果摘要的一个选择目标。用户极有可能通过网站的摘要来决定是否浏览该网站。

推荐做法：

* 网站首页、频道页、产品参数页等没有大段文字可以用做摘要的网页最适合使用description
* 准确的描述网页，不要堆砌关键词
* 为每个网页创建不同的description，避免所有网页都使用同样的描述
* 长度合理，不过长不过短（最好在100-150个字符，对应中文就是50到75个汉字）。

示例：

```html
<meta name="description" content="阿里巴巴（1688.com）批发网是全球企业间（B2B）电子商务的著名品牌，为数千万网商提供海量商机信息和便捷安全的在线交易市场，也是商人们以商会友、真实互动的社区平台。目前1688.com已覆盖原材料、工业品、服装服饰、家居百货、小商品等12个行业大类，提供从原料--生产--加工--现货等一系列的供应产品和服务。"
  />
<meta name="description" content="京东JD.COM-专业的综合网上购物商城,销售家电、数码通讯、电脑、家居百货、服装服饰、母婴、图书、食品等数万个品牌优质商品.便捷、诚信的服务，为您提供愉悦的网上购物体验!" />
```

### 三、keywords

keywords在搜索排名的权重不高，但是合理的设置，可以提高关键字的密度及优化搜索结果页的体验。通过加大关键词的密度，从而提高关键词在搜索引擎的排名，是SEO优化的一个常用手段。

SEO的核心思想是每个页面抓住几个关键字（一般不超过5个）进行核心优化，所以设定与本页内容相关的主关键词一到三个就可以了。关键字之间用英文状态下的逗号分割，不要再滥用关键字，这会给搜索引擎不好的印象。

示例：
```html
<meta name="keywords" content="阿里巴巴，批发网，1688，批发市场，批发，采购，微商，微店，货源"/>

<meta name="keywords" content="网上购物,网上商城,手机,笔记本,电脑,MP3,CD,VCD,DV,相机,数码,配件,手表">
```


## 05: script标签中defer和async的区别?
默认情况下，脚本的下载和执行将会按照文档的先后顺序同步进行。当脚本下载和执行的时候，文档解析就会被阻塞，在脚本下载和执行完成之后文档才能往下继续进行解析。

下面是async和defer两者区别：

* 当script中有defer属性时，脚本的加载过程和文档加载是异步发生的，等到文档解析完(DOMContentLoaded事件发生)脚本才开始执行。

* 当script有async属性时，脚本的加载过程和文档加载也是异步发生的。但脚本下载完成后会停止HTML解析，执行脚本，脚本解析完继续HTML解析。

* 当script同时有async和defer属性时，执行效果和async一致。