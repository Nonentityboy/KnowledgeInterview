## 二叉树概念

二叉树是每个节点最多有两个子树的树结构，通常子树被称作“左子树”和“右子树”。


## 二叉树中序遍历

给定一个二叉树，返回它的 `中序` 遍历。

示例:
```
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 
输出: [1,3,2]
```

```js
var inorderTraversal = function(root) {
    let arr = [];
    let traverse = (root) => {
        if(root === null) return;
        traverse(root.left);
        arr.push(root.val);
        traverse(root.right);
    }
    traverse(root);
    return arr;
};
```



## 二叉树前序遍历

给定一个二叉树，返回它的 `前序` 遍历。

示例:
```
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 
输出: [1,2,3]
```

```js
var preorderTraversal = function(root) {
    let arr = [];
    let traverse = (root) => {
        if(root === null) return;
        arr.push(root.val);
        traverse(root.left);
        traverse(root.right);
    }
    traverse(root);
    return arr;
};
```


## 二叉树后序遍历

给定一个二叉树，返回它的 `前序` 遍历。

示例:
```
输入: [1,null,2,3]  
   1
    \
     2
    /
   3 
输出: [3,2,1]
```

```js
var postorderTraversal = function(root) {
    let arr = [];
    let traverse = (root) => {
        if(root === null) return;
        traverse(root.left);
        traverse(root.right);
        arr.push(root.val);
    }
    traverse(root);
    return arr;
};
```


## 二叉树的最大深度
给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

示例：
```
给定二叉树 [3,9,20,null,null,15,7]，

    3
   / \
  9  20
    /  \
   15   7
返回它的最大深度 3 
```


* 深度优先遍历(DFS) + 分治
* 找出终止条件：当前节点为空
* 找出返回值：节点为空时说明高度为0，所以返回0；节点不为空时则分别求左右子树的高度的最大值，同时加1表示当前节点的高度，返回该数值
* 一棵二叉树的最大深度等于左子树深度和右子树最大深度的最大值 + 1
* 时间复杂度： O(n)
* 空间复杂度： O(log⁡(n))


```js
var maxDepth = function (root) {
    if (!root) {
        return 0;
    } else {
        let left = maxDepth(root.left);
        let right = maxDepth(root.right);
        return Math.max(left,right) + 1;
    }
};
```