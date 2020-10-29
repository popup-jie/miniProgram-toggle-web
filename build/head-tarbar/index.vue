<template>
  <div class="components-class">
    <div  class="prohibition custom-class"><div  class="nav":style="height:  nav.height + 5 + 'px';background-color:{{color}}"><div :style="height: nav.top + 'px'"></div>
<div :style="height: nav.height - nav.top + 'px'" class="warpper"><div :class="left-icon isGoBack ? 'left-icond': ''"><van-icon  name="arrow-left" custom-class="arrow-left" v-if="isGoBack" @click.stop="navBack()"><slot  name="left-icon"></slot>
</van-icon>
</div>
<div  class="title">{{title}}</div>
</div>
<div  style="height: 8px"></div>
</div>
<div  v-if="isSeat":style="height:  nav.height + 'px'"></div>
</div>
  </div>
</template>

<script>
  const App = getApp();
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    isSeat: {
      type: Boolean,
      default: false

    },
    isFixed: {
      type: Boolean,
      default: true

    },
    color: {
      type: String,
      default: 'red'
    },
    isGoBack: { // 是否返回
      type: Boolean,
      default: true

    },
    backBefore: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      nav: {
        top: 0,
        height: 0
      }
    };
  },

  beforeCreate() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    let { statusBarHeight } = App.globalData.systemInfo;
    let navTop = menuButtonObject.top;
    let navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;
    this.nav = {
      top: navTop,
      height: navHeight
    };
  },

  methods: {
    //回退
    navBack: function () {
      let { backBefore } = this.data;
      if (backBefore !== '') {
        let _now = wx.$getNowPage();
        _now[backBefore](this.isNext);
      } else {
        this.isNext(true);
      }
    },
    isNext(bool) {
      if (bool) {
        wx.navigateBack({
          delta: 1
        });
      }
    }
  }
};
</script>


<style lang='scss'>
  .top-nav {
  position: relative;
}

.prohibition {
  position: relative;
  width: 100%;
  .nav {
    position: relative;
    left: 0;
    right: 0;
    background: inherit;
  }

  .love-fixed {
    position: fixed !important;
    z-index: 1000;
    top: 0;
    width: 100%;
    left: 0;
  }

  .warpper {
    display: flex;
    position: relative;
    text-align: center;
    align-content: center;
    align-items: center;
    justify-content: center;

    .left-icon {
      position: absolute;
      left: 30px;
      align-content: center;
      display: flex;
      align-items: center;
      &.left-icond {
        left: 9px;
      }
      .arrow-left {
        font-size: 40px;
      }
    }
    .title {
      font-size: 26px;
    }
  }
}

</style>
