
import { ybfComponent } from '../common/index'

ybfComponent({
  options: {
    multipleSlots: true
  },
  props: {
    // 快递是否可点
    isEdit: {
      type: Boolean,
      value: false
    },
    showFooter: {
      type: Boolean,
      value: true
    },
    // 数据对象
    list: Object,
    // 当前下标
    index: Number,
    // 是否包邮 默认为不包邮
    isFreeShipping: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  created() {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择快递
    chooseCourier() {
      if (this.data.isEdit) {
        this.$emit('chooseCourier', {
          list: this.data.list,
          index: this.data.index
        })
      }
    },
    lookLogic() {
      this.$emit('lookLogic', {
        list: this.data.list,
        index: this.data.index
      })
    },
  }
})
