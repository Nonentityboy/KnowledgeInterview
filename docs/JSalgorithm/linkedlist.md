## 删除链表中的节点

请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点，你将只被给定要求被删除的节点。

现有一个链表 -- head = [4,5,1,9]，它可以表示为:

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/01/19/237_example.png)

示例 1:

```
输入: head = [4,5,1,9], node = 5
输出: [4,1,9]
解释: 给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
```


示例 2:

```
输入: head = [4,5,1,9], node = 1
输出: [4,5,9]
解释: 给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.
```

时间复杂度：O(1)
空间复杂度：O(1)

```js
var deleteNode = function(node) {
    node.val = node.next.val;
    node.next = node.next.next;
    return;
};
```



## 移除链表元素

删除链表中等于给定值 val 的所有节点。

示例:

```
输入: 1->2->6->3->4->5->6, val = 6
输出: 1->2->3->4->5
```


时间复杂度：O(n)
空间复杂度：O(1)
```js
var removeElements = function(head, val) {
    let newHead = new ListNode(null);
    newHead.next = head;
    let cur = head;
    let pre = newHead;
    while(cur){
        if(cur.val === val){
            pre.next = cur.next;
            cur = pre.next;
        } else {
            cur = cur.next;
            pre = pre.next;
        }
    }
    return newHead.next;
};
```

##  环形链表
给定一个链表，判断链表中是否有环。

为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

 

示例 1：
```
输入：head = [3,2,0,-4], pos = 1
输出：true
解释：链表中有一个环，其尾部连接到第二个节点
```

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)

### 方法一：快慢指针

设置快慢两个指针，遍历单链表，快指针一次走两步，慢指针一次走一步，如果单链表中存在环，则快慢指针终会指向同一个节点，否则直到快指针指向 null 时，快慢指针都不可能相遇

* 时间复杂度：O(n)
* 空间复杂度：O(1)
```js
var hasCycle = function(head) {
    if(!head || !head.next) return false;
    let slow = head;
    let fast = head.next;
    while(slow != fast){
        if(!fast || !fast.next) return false;
        slow = slow.next;
        fast = fast.next.next;
    }
    return true;
};
```

### 方法二：标志法
给每个已遍历过的节点加标志位，遍历链表，当出现下一个节点已被标志时，则证明单链表有环。

* 时间复杂度：O(n)
* 空间复杂度：O(n)

```js
var hasCycle = function(head) {
    while(head) {
        if(head.flag) return true
        head.flag = true
        head = head.next
    }
    return false
};
```


## 环形链表 II
给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。

说明：不允许修改给定的链表。

 
示例 1：
```
输入：head = [3,2,0,-4], pos = 1
输出：tail connects to node index 1
解释：链表中有一个环，其尾部连接到第二个节点。
```

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/07/circularlinkedlist.png)


不管有没有环, 以及进环前和进换后耗时都与数据规模成正比, 所以时间复杂度为O(n), 因为只需额外的常数级存储空间记录两个指针, 所以空间复杂度为O(1)。
* 时间复杂度：O(n)
* 空间复杂度：O(1)

```js
var detectCycle = function(head) {
    if(!head || !head.next) return null;
    let fast = head;
    let slow = head;
    while(fast && fast.next){
        slow = slow.next;
        fast = fast.next.next;
        if(slow === fast){
            let p = head;
            while(p !== slow){
                p = p.next;
                slow = slow.next;
            }
            return slow;
        }
    }
    return null;
};
```

## 相交链表
找到两个单链表相交的起始节点

![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/160_statement.png)

题解：双指针法，A和B一起遍历到末节点，交换位置，从新遍历。第二遍时候，第一次相遇就是节点了。
```js
var getIntersectionNode = function(headA, headB) {
    let pA = headA;
    let pB = headB;
    while(pA !== pB) {
        pA = pA ? pA.next : headB;
        pB = pB ? pB.next : headA; 
    }
    return pA;
};
```