import { ybfComponent } from '../../common/index'
ybfComponent({
  /**
   * 组件的属性列表
   */
  props: {
    list: {
      type: Array,
      value: [],
      observer(newVal) {
        if (newVal.length % 2 == 0) {
          newVal[newVal.length - 1].noBorder = true
          newVal[newVal.length - 2].noBorder = true
        } else if (newVal.length % 2 == 1) {
          newVal[newVal.length - 1].noBorder = true
        }
        this.setData({
          forlist: newVal
        })
      }
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    forlist: []
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
