# 排序

## 冒泡排序

### 概念
当前元素和下一个元素，如果当前元素比下一个元素大，向上冒泡。

这样一次循环之后最后一个数就是本数组最大的数。

下一次循环继续上面的操作，不循环已经排序好的数。

优化：当一次循环没有发生冒泡，说明已经排序完成，停止循环。
```js
function bubbleSort(array) {
    for (let j = 0; j < array.length; j++) {
        let complete = true;
        for (let i = 0; i < array.length - 1 - j; i++) {
            // 比较相邻数
            if (array[i] > array[i + 1]) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
                complete = false;
            }
        }
        // 没有冒泡结束循环
        if (complete) {
            break;
        }
    }
    return array;
}
```

### 复杂度
时间复杂度：O(n2)

空间复杂度：O(1)

### 稳定性
稳定。   原地排序


## 选择排序

### 思想
每次循环选取一个最小的数字放到前面的有序序列中。
![](https://s1.ax1x.com/2020/07/14/UadD8x.gif)

```js
function selectionSort(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        [array[minIndex], array[i]] = [array[i], array[minIndex]];
    }
}
```
### 复杂度
时间复杂度：O(n2)

空间复杂度：O(1)

### 稳定性
不稳定



## 插入排序


### 解法

将左侧序列看成一个有序序列，每次将一个数字插入该有序序列。

插入时，从有序序列最右侧开始比较，若比较的数较大，后移一位。

![](https://s1.ax1x.com/2020/07/14/UawuQK.gif)
```js
function insertSort(array) {
    for (let i = 1; i < array.length; i++) {
        let target = i;
        for (let j = i - 1; j >= 0; j--) {
            if (array[target] < array[j]) {
                [array[target], array[j]] = [array[j], array[target]]
                target = j;
            } else {
                break;
            }
        }
    }
    return array;
}
```
### 复杂度
时间复杂度：O(n2)

空间复杂度：O(1)

### 稳定性
稳定

## 归并排序
利用归并的思想实现的排序方法。

>该算法是采用`分治法（Divide and Conquer）`的一个非常典型的应用。（分治法将问题分成一些小的问题然后递归求解，而治的阶段则将分的阶段得到的各答案"修补"在一起，即分而治之)。

* 将已有序的子序列合并，得到完全有序的序列

* 即先使每个子序列有序，再使子序列段间有序

* 若将两个有序表合并成一个有序表，称为二路归并


分割：

* 将数组从中点进行分割，分为左、右两个数组

* 递归分割左、右数组，直到数组长度小于等于2

归并：

* 如果需要合并，那么左右两数组已经有序了。

* 创建一个临时存储数组temp，比较两数组第一个元素，将较小的元素加入临时数组

* 若左右数组有一个为空，那么此时另一个数组一定大于temp中的所有元素，直接将其所有元素加入temp

## 快速排序

### 思想
快速排序：通过一趟排序将要排序的数据分割成独立的两部分，其中一部分的所有数据比另一部分的所有数据要小，再按这种方法对这两部分数据分别进行快速排序，整个排序过程可以递归进行，使整个数据变成有序序列。

实现步骤：

* 选择一个基准元素target（一般选择第一个数）
* 将比target小的元素移动到数组左边，比target大的元素移动到数组右边
* 分别对target左侧和右侧的元素进行快速排序

快速排序利用了分治的思想（将问题分解成一些小问题递归求解）

![](https://s1.ax1x.com/2020/07/14/Ua0nts.jpg)

![](https://s1.ax1x.com/2020/07/14/Ua0w1x.gif)


### 复杂度
时间复杂度：平均O(nlogn)，最坏O(n2)，实际上大多数情况下小于O(nlogn)

空间复杂度:O(logn)（递归调用消耗）

### 稳定性
不稳定