import { ybfComponent } from '../common/index'

ybfComponent({
  props: {
    show: {
      type: Boolean
    },
    title: {
      type: String,
      value: ''
    },
    comfirmText: {
      type: String,
      value: '确定'
    },
    dataColumns: {
      type: Array,
      value: [],
      observer(newVal) {
        if (Array.isArray(newVal)) {
          this.setData({
            chooseValue: newVal[0] || {}
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chooseValue: {}
  },

  mounted() {
    // if (Array.isArray(this.data.dataColumns)) {
    //   this.setData({
    //     chooseValue: this.data.dataColumns[0] || {}
    //   })
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    popUpOnClose() {
      this.$emit('close');
    },
    saveHandle() {
      this.$emit('comfirmHandle', this.data.chooseValue)
      this.popUpOnClose()
    },

    onChange(event) {
      const { picker, value, index } = event.detail;

      this.setData({
        chooseValue: value
      })
    }
  }
})
