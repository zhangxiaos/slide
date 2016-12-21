## slide

用原声js写的移动端的滑动框架，无依赖，轻盈小巧

## 使用方法


```javascript
     var pages = new Slide({
       container: document.querySelector('.pages'), // 轮播容器
       direction: 'X', // 方向
        slideEnd: function(pre, cur) { // 滑动结束的callback
          console.log(pre, cur);
        }
      });
```


##API

###Slide([option])

**option完整参数如下：**

- `container`：String，容器包裹，默认值`.slider`

- `direction`：String，滑动方向，默认值`X`横向滑动；若设置为`Y`，则为纵向滑动

- `threshold`：Number，滑动距离阈值，默认值`50`，当按住屏幕滑动超过此距离，松开手时，自动滑到下一屏，否则不滑动

###事件

- `slideEnd`：滑动结束时，触发`slideEnd`事件，回调函数传入两个参数，分别是上一屏和当前屏索引，从`0`算起。举例，从第一屏滑动到第二屏结束时：

```javascript
    var slide = new Slide({ container: document.querySelector('.pages') });
    slide.on('slideEnd', function(prev, cur){
        console.log('上一屏索引：', prev); // 0
        console.log('当前屏索引：', cur); // 1
    });
```

### 方法

- `next`: 主动滑动到下一屏。

```
    var slide = new Slide({ container: document.querySelector('.pages') });
    slide.next();
```

- `go`: 主动滑动到指定界面。

```
    var slide = new Slide({ container: document.querySelector('.pages') });
    slide.go(2);
```

