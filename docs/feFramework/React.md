# React 框架

## 1. 声明式编程与命令式编程

`声明式编程`是一种编程范式，它关注的是`要做什么`，而不是`如何做`。它表达逻辑而不显式地定义步骤。
> 通俗的来讲就是：声明式编程地编写方式描述了应该做什么。

例子：HTML file、SQL file

```html
<div>
    <p>ketingliu is cool!</p>
</div>
```

```sql
select * from students where firstName = 'declarative';
```

`命令式编程`描述了如何做。在声明式编程中，让编译器决定如何做事情。声明性程序很容易推理，因为代码本身描述了它在做什么。

下面是一个例子，需要编写所有的流程步骤。

```js
const numbers = [1,2,3,4,5];

// 声明式
const doubleWithDec = numbers.map(number => number * 2);

console.log(doubleWithDec)

// 命令式
const doubleWithImp = [];
for(let i=0; i<numbers.length; i++) {
    const numberdouble = numbers[i] * 2;
    doubleWithImp.push(numberdouble)
}

console.log(doubleWithImp)
```
 
## 2. 函数式编程

* 不可变性(Immutability)
* 纯函数(Pure Functions)
* 数据转换(Data Transformations)
* 高阶函数 (Higher-Order Functions)
* 递归
* 组合

## 3. React
一个简单的JavaScript UI库，用于构建高效、快速的用户界面。它是一个轻量级库，因此很受欢迎。它遵循组件设计模式、声明式编程范式和函数式编程概念，以使前端应用程序更高效。它使用虚拟DOM来有效地操作DOM。它遵循从高阶组件到低阶组件的单向数据流。

### React 与 Angular 

* Angular是一个成熟的MVC框架，带有很多特定的特性，比如服务、指令、模板、模块、解析器等等。
* React是一个非常轻量级的库，它只关注MVC的视图部分。
* Angular遵循两个方向的数据流，而React遵循从上到下的单向数据流。
* React在开发特性时给了开发人员很大的自由，例如，调用API的方式、路由等等。我们不需要包括路由库，除非我们需要它在我们的项目。

## 4. Virtual DOM及其工作原理
React 使用 Virtual DOM 来更新真正的 DOM，从而提高效率和速度。

## 5. 什么是 JSX
JSX是javascript的语法扩展。它就像一个拥有javascript全部功能的模板语言。它生成React元素，这些元素将在DOM中呈现。React建议在组件使用JSX。在JSX中，我们结合了javascript和HTML，并生成了可以在DOM中呈现的react元素。

JSX的一个例子。我们可以看到如何将javascript和HTML结合起来。如果HTML中包含任何动态变量，我们应该使用表达式{}。
```js
import React from 'react';

export const Header = () => {

    const heading = 'TODO App'

    return(
        <div style={{backgroundColor:'orange'}}>
            <h1>{heading}</h1>
        </div>
    )
}
```

## 6. 组件和不同类型

* 函数/无状态/展示组件
* 类/有状态组件
* 受控组件
* 非受控组件
* 容器组件
* 高阶组件

## 7. Props 和 State
Props 是只读属性，传递给组件以呈现UI和状态，可以更改组件的输出。

下面是一个类组件的示例，它在构造函数中定义了 `props` 和 `state`，每当使用 `this.setState()` 修改状态时，将会再次调用 `render()` 函数来更改UI 中组件的输出。

```js
import React from 'react';
import '../App.css';

export class Dashboard extends React.Component {

  constructor(props){
    super(props);

    this.state = {
        name: "some name"
    }
  }

  render() {

    // reading state
    const name = this.state.name;

    //reading props
    const address = this.props.address;

    return (
      <div className="dashboard"> 
          {name}
          {address}
      </div>
    );
  }
}
```

## 8. 若你的react项目不使用TypeScript，那请使用 PropTypes 进行类型检查


> 随着时间的推移，应用程序会变得越来越大，因此类型检查非常重要。


PropTypes为组件提供类型检查，并为其他开发人员提供很好的文档。如果react项目不使用 Typescript，建议为组件添加 PropTypes。
如果组件没有收到任何 props，我们还可以为每个组件定义要显示的默认 props。这里有一个例子。UserDisplay有三个 prop:name、address和age，我们正在为它们定义默认的props 和 prop类型。


```js

import React from 'react';
import PropTypes from 'prop-types';

export const UserDisplay = ({name, address, age}) => {

    UserDisplay.defaultProps = {
        name: 'myname',
        age: 100,
        address: "0000 onestreet"
    };

    return (
        <>
            <div>
                <div class="label">Name:</div>
                <div>{name}</div>
            </div>
            <div>
                <div class="label">Address:</div>
                <div>{address}</div>
            </div>
            <div>
                <div class="label">Age:</div>
                <div>{age}</div>
            </div>
        </>
    )
}

UserDisplay.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.objectOf(PropTypes.string),
    age: PropTypes.number.isRequired
}

```


## 9. 如何更新状态以及如何不更新
你不应该直接修改状态。可以在构造函数中定义状态值。直接使用状态不会触发重新渲染。React 使用this.setState()时合并状态。

```js
//  错误方式
this.state.name = "some name"
//  正确方式
this.setState({name:"some name"})
```

使用this.setState()的第二种形式总是更安全的，因为更新的props和状态是异步的。这里，我们根据这些 props 更新状态。

```js
// 错误方式
this.setState({
    timesVisited: this.state.timesVisited + this.props.count
})
// 正确方式
this.setState((state, props) => {
    timesVisited: state.timesVisited + props.count
});
```

## 10. Redux及其工作原理

Redux 是react的一个状态管理库，它基于flux。redux简化了React中的单向数据流。 Redux 将状态管理从React中抽象出来。

### redux如何工作

* React中，组件连接到redux，如果要访问redux，需要排除一个包含 `id` 和负载（payload）的 `action`。action 中的 `payload`是可选的，action 将其转发给 Reducer
* `reducer`收到`action`时，通过`switch case`语法比较 `action`中的 `type`。 匹配时，更新内容返回新的 `state`
* `redux`状态更改时，连接`redux`的组件将接受新的状态作为`props`。当组件接收到这些`props`时，它将进入更新阶段并重新渲染UI


