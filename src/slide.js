(function (name, func) {
  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") { 
    module.exports = func;
  }
  else if (typeof define === 'function') {
    define(func);
  }
  else {
    window[name] = func();
  }
})('Slide', function() {
  // PageSlide接收三个参数:页面元素,要设定的滑动方向,可选的扩展函数
  var Slide = function(options) {
    this.wrap       = options.wrap;
    this.type       = options.type || 'X';
    this.onSlideEnd = options.onSlideEnd || function(){};

    this.curIndex = 0; // 当前页面索引
    this.pageX;        // 横向的手指落点
    this.pageY;        // 纵向的手指落点
    this.height;       // 设备高度
    this.width;        // 设备宽度
    this.flag;         // 判断滑动方向的变量
    this.move;         // 滑动的距离

    // 初始化 
    this._resize()._init()._bindEvents(); 
  }

  Slide.prototype = {
    constructor: Slide,
    
    _init: function(i) {
      var curEl = i ? this.wrap.children[i] : this.wrap.firstElementChild;
      if (!curEl) throw 'ERROR';

      curEl.classList.add('moving');

      curEl.style.webkitTransform = 'translate3d(0, 0, 0)';

      // 以swiper的值预设置其他页面的宽高，获得流畅的交互效果
      for (var i = 1, len = this.wrap.children.length; i < len; i++) {
        this['_set' + this.type](this.wrap.children[i], (this.type === 'X' ? this.width : this.height));
      }

      setTimeout(function() {
        curEl.classList.remove('moving');
        curEl.classList.add('play');
      }, 300);

      return this;
    },

    
    _resize: function() {
      var parentNode = this.wrap.parentNode;
      this.width = parentNode.clientWidth;
      this.height = parentNode.clientHeight;
      return this;
    },

    // 为页面绑定各种事件的绑定函数
    _bindEvents: function() {
      var _this = this;
      window.addEventListener('resize orientationchange', this._resize.bind(this), false);
      document.addEventListener('touchmove', function(e) {
        e.preventDefault();
      });

      'touchstart touchmove touchend touchcancel'.split(' ').forEach(function(evn) {
        _this.wrap.addEventListener(evn, _this['_' + evn].bind(_this), false);
      }); 
    },

    _touchstart: function(e) {
      var touches = e.touches[0];

      this.flag = null;
      this.move = 0;

      //记录落点
      this.pageX = touches.pageX;
      this.pageY = touches.pageY;
    },

    _touchmove: function(e) {
      var touches = e.touches[0],
          disX    = touches.pageX - this.pageX,
          disY    = touches.pageY - this.pageY,
          curEl   = this.getCurrent(),
          next    = curEl.nextElementSibling,
          prev    = curEl.previousElementSibling;

      //添加移动样式
      if (!this.flag) {
        this.flag = Math.abs(disX) > Math.abs(disY) ? 'X' : 'Y';
      }

      if (this.flag === this.type) {
        e.preventDefault();
        e.stopPropagation();

        curEl.classList.add('moving');
        next && next.classList.add('moving');
        prev && prev.classList.add('moving');

        switch (this.type) {
          case 'X':
            this.move = disX;
            this._setX(curEl, disX);
            next && (this._setX(next, disX + this.width));
            prev && (this._setX(prev, disX - this.width));
            break;
          case 'Y':
            this.move = disY;
            this._setY(curEl, disY);
            next && (this._setY(next, disY + this.height));
            prev && (this._setY(prev, disY - this.height));
            break;
        }
      }
    },

    _touchend: function(e) {
      var minRange = 50,
          move     = this.move,
          curEl    = this.getCurrent(),
          next     = curEl.nextElementSibling,
          prev     = curEl.previousElementSibling;

      curEl.classList.remove('moving');
      next && next.classList.remove('moving');
      prev && prev.classList.remove('moving');

      if (!this.flag) return;
      e.preventDefault();

      // 滑动结束前往下一页面,next()方法调用了go()方法
      if (move < -minRange && next) {
        this._next();
      } 

      if (move > minRange && prev) {
        this._prev();
      }

      this._reset();
    },

    _touchcancel: function(e) {
      var curEl = this.getCurrent(),
          next  = curEl.nextElementSibling,
          prev  = curEl.previousElementSibling;

      current.classList.remove('moving');
      next && next.classList.remove('moving');
      prev && prev.classList.remove('moving');

      this._reset();
    },

    // 动态设定translate3d参数方法
    _setX: function(el, x) {
      el && (el.style.webkitTransform = 'translate3d(' + x + 'px' + ',0,0)');
    },
    _setY: function(el, y) {
      el && (el.style.webkitTransform = 'translate3d(0,' + y + 'px' + ',0)');
    },

    // 设置当前触控页面translate3d参数为0的方法
    _setCurrent: function(el, i) {
      el && (el.style.webkitTransform = 'translate3d(0,0,0)');

      if (i) {
        this.curIndex = i;
        this.curEle = this.wrap.children[i];
      }

    },

    //重置方法,用于初始化以及当前页面的重置
    _reset: function() {
      var width  = this.width,
          height = this.height,
          type   = this.type,
          curEl  = this.getCurrent(),
          next   = curEl.nextElementSibling,
          prev   = curEl.previousElementSibling;
     
      this._setCurrent(curEl);

      prev && (this['_set' + type](prev, -(type === 'X' ? width : height)));
      next && (this['_set' + type](next, (type === 'X' ? width : height)));
    },

    _next: function() {
      this.go(this.curIndex + 1);
    },

    _prev: function() {
      this.go(this.curIndex - 1);
    },

    _finish: function(curEl, target) {
      this.flag = null;
      setTimeout(function() {
        curEl && curEl.classList.remove('play');
        target && target.classList.add('play');
      }, 300);
    },

    go: function(i) {
      var onSlideEnd = this.onSlideEnd,
          curEl = this.getCurrent(),
          total = this.wrap.childElementCount,
          target = this.wrap.children[i],
          d = i < this.curIndex ? -1 : 1;

      if (i === this.curIndex || i < 0 || i >= total) return;

      // 滑动完成调用方法
      if (onSlideEnd && (typeof onSlideEnd === 'function')) {
        onSlideEnd.call(this, i);
      }

      this.curIndex = i;
      this['_set' + this.type](curEl, -d * (this.type === 'X' ? this.width : this.height));
      this._setCurrent(target, i);
      this._finish(curEl, target);
    },

    // 获得当前触控的页面对象
    getCurrent: function() {
      return this.wrap.children[this.curIndex];
    },
  };
  return Slide;
});
