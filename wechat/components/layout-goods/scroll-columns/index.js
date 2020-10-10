import { ybfComponent } from '../../common/index'
ybfComponent({
  /**
   * 组件的属性列表
   */
  props: {
    list: Array
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
      const item = e.currentTarget.dataset.item
      this.$emit('lookDetail', item)
    }
  }
})
