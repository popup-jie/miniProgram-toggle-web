// components/choose-courier/index.js
import { ybfComponent } from '../common/index'

ybfComponent({
  
  props: {
    isEdit: {
      type: Boolean,
      value: false
    },
    list: Object,
    index: Number
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
  }
})
