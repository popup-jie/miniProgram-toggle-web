import { ybfComponent } from '../common/index'
const App = getApp()
ybfComponent({
  props: {
    title: {
      type: String,
      value: '标题'
    },
    isSeat: {
      type: Boolean,
      value: false
    },
    isFixed: {
      type: Boolean,
      value: true
    },
    color: {
      type: String,
      value: 'red'
    },
    isGoBack: { // 是否返回
      type: Boolean,
      value: true
    },
    backBefore: {
      type: String,
      value: ''
    }
  },

  data: {
    nav: {
      top: 0,
      height: 0
    }
  },

  created() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    let { statusBarHeight } = App.globalData.systemInfo
    let navTop = menuButtonObject.top
    let navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2
    this.setData({
      nav: {
        top: navTop,
        height: navHeight
      }
    })
  },

  methods: {
    //回退
    navBack: function () {
      let { backBefore } = this.data
      if (backBefore !== '') {
        let _now = wx.$getNowPage()
        _now[backBefore](this.isNext)
      } else {
        this.isNext(true)
      }
    },
    isNext(bool) {
      if (bool) {
        wx.navigateBack({
          delta: 1
        })
      }
    },
  }
})
