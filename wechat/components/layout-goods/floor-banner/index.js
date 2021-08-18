import {
  ybfComponent
} from '../../common/index'
ybfComponent({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */

  props: {
    item: Object,
    showPrice: {
      type: Boolean,
      value: true
    },
    btnClass: String,
    splitLine: {
      type: String,
      value: 'van-ellipsis'
      // value: 'van-multi-ellipsis--l3'
    },
    btnText: {
      type: String,
      value: '去购买'
    },
    showBtn: {
      type: Boolean,
      value: true
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFreeShippingAll: false
  },
  mounted() {
    this.setData({
      isFreeShippingAll: getApp().globalData.isFreeShippingAll
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lookDetail(e) {
      this.$emit('lookDetail', this.data.item)
    },

    btnHandle() {
      this.$emit('btnHandle', this.data.item)
    }
  },
  created() { }
})