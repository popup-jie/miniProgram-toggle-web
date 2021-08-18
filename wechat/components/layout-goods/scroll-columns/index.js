import { ybfComponent } from '../../common/index'
ybfComponent({
  /**
   * 组件的属性列表
   */
  props: {
    list: Array,
    btnText: {
      type: String,
      value: '去购买'
    },
    btnClass: String,
    showBtn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    scrollViewHeight: 0,
    isFreeShippingAll: false
  },

  mounted() {
    // 获取顶部信息元素大小，计算滚动需要使用到
    const query = this.createSelectorQuery()
    query.select('.columns-wrapper').boundingClientRect()
    query.exec((res) => {
      this.setData({
        scrollViewHeight: res[0].height,
        isFreeShippingAll: getApp().globalData.isFreeShippingAll
      })
      //  this._topHeight = res[0].height + res[0].top - navHeight - 60
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    lookDetail(e) {
      const item = e.currentTarget.dataset.item
      this.$emit('lookDetail', item)
    },
    btnHandle(e) {
      const item = e.currentTarget.dataset.item
      this.$emit('btnHandle', item)
    }
  }
})
