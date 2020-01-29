# Vue-cli3-Nuggets-Brochure
补一下Vue相关基础的demo。


## 脚手架

无论是前端还是后台，其实它在生活中的含义是为了保证各`施工过程顺利进行而搭设的工作平台`。因此作为一个工作平台，`前端的脚手架`可以理解为能够帮助我们`快速构建前端项目`的一个工具或平台。

## Vue-cli

脚手架，目前很多`主流的前端框架`都提供了各自`官方的脚手架工具`，以帮助开发者快速构建起自己的项目，比如 Vue、React 等，这里我们就来介绍下 Vue 的脚手架工具 vue-cli

## a. 安装
我们可以在终端通过以下命令全局安装 vue-cli：

### 安装 Vue CLI 3.x

```
npm i -g @vue/cli
如果你习惯使用 yarn，你也可以：
```

### 没有全局安装yarn需执行此命令
```
npm i -g yarn
yarn global add @vue/cli
```

注意因为是全局安装，所以 vue-cli 是全局的包，它和我们所处的项目没有关系。同时我们这里介绍的 CLI 版本是最新的 3.x，它和 2.x 版本存在着很大的区别

## b. 构建
安装完 vue-cli 后，我们在你想要创建的项目目录地址下执行构建命令：

### my-project 是你的项目名称
```
vue create my-project
```
执行完上述命令后，会出现一系列的选择项，我们可以根据自己的需要进行选择，流程图如下：

![image](https://user-gold-cdn.xitu.io/2018/6/18/16412343fab2e351?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


如果你只想构建一个基础的 Vue 项目，那么使用 Babel、Router、Vuex、CSS Pre-processors 就足够了，最后选择你喜欢的包管理工具 npm or yarn。

## c. 启动
等待构建完成后你便可以运行命令来启动你的 Vue 项目：

## 打开项目目录
```
cd vue-project
```

## 启动项目
```
yarn serve
```

## or
```
npm run serve
```

>需要注意的是如果启动的时候出现报错或者包丢失等情况，最好将 node 或者 yarn （如果使用）的版本更新到最新重新构建。

成功后打开浏览器地址：http://localhost:8080/ 可以看到如下界面：

![](https://user-gold-cdn.xitu.io/2018/6/18/164125dcfb6fa7d5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## d. 目录结构
最后脚手架生成的目录结构如下：

```
├── node_modules     # 项目依赖包目录
├── public
│   ├── favicon.ico  # ico图标
│   └── index.html   # 首页模板
├── src 
│   ├── assets       # 样式图片目录
│   ├── components   # 组件目录
│   ├── views        # 页面目录
│   ├── App.vue      # 父组件
│   ├── main.js      # 入口文件
│   ├── router.js    # 路由配置文件
│   └── store.js     # vuex状态管理文件
├── .gitignore       # git忽略文件
├── .postcssrc.js    # postcss配置文件
├── babel.config.js  # babel配置文件
├── package.json     # 包管理文件
└── yarn.lock        # yarn依赖信息文件
```

根据你安装时选择的依赖不同，最后生成的目录结构也会有所差异。

## 可视化界面
当然，除了使用上述命令行构建外，vue-cli 3.x 还提供了可视化的操作界面，在项目目录下我们运行如下命令开启图形化界面：

vue ui
之后浏览器会自动打开本地 8000 端口，页面如下：

![image](https://user-gold-cdn.xitu.io/2018/6/26/1643ca037f818a81?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

如果你还没有任何项目，那么可以点击创建或者直接导入现有的项目。创建项目和我们使用命令行的步骤基本相同，完全可视化操作，一定程度上降低了构建和使用的难度。项目创建或导入成功后你便可以进入项目进行可视化管理了。

![image](https://user-gold-cdn.xitu.io/2018/6/26/1643ca8799bb4491?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在整个管理界面中，我们可以为自己的项目安装 CLI 提供的插件，比如安装 `@vue/cli-plugin-babel` 插件，同时我们也可以配置相应插件的配置项，进行代码的编译、热更新、检查等。