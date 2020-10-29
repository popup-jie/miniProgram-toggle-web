import { ybfComponent } from '../common/index'

ybfComponent({
  props: {
    title: {
      type: String,
      value: ''
    },
    show: Boolean,
    useTitleSlot: Boolean,
    useFooterSlot: Boolean,
    comfirmText: String,
    height: {
      type: Number,
      value: 60
    },
    titleStyle: String
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
    onClose() {
      this.$emit('onClose')
    },
    saveHandle() {
      this.$emit('comfirmHandle')
    }
  }
})
