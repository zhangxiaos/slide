## slide

用原声js写的移动端的滑动框架，无依赖，轻盈小巧

## 使用方法

      var pages = new Slide({
       wrap: document.querySelector('.pages'), // 轮播容器
       type: 'Y', // 方向
        onSlideEnd: function(i) { // 滑动结束的callback
          console.log(i);
        }
      });

