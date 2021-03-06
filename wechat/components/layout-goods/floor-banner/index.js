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
    splitLine: {
      type: String,
      value: 'van-ellipsis'
      // value: 'van-multi-ellipsis--l3'
    },
    goBuy: {
      type: Boolean,
      value: true
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    lookDetail(e) {
      this.$emit('lookDetail', this.data.item)
    }
  },
  created() { }
})