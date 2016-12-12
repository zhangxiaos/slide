# slide

### 原声js实现的一个移动端swiper轮播组件

#### 使用方法：

      var pages = new Slide({
       wrap: document.querySelector('.pages'), // 轮播容器
       type: 'Y', // 方向
        onSlideEnd: function(i) { // 滑动结束的callback
          console.log(i);
        }
      });

#### 效果图：
￼ ![image](https://github.com/zhangxiaos/slide/blob/master/slide1.png)
￼ ![image](https://github.com/zhangxiaos/slide/blob/master/slide2.png)
