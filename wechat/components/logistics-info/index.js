import { ybfComponent } from '../common/index'

ybfComponent({
  /**
   * 组件的属性列表
   */
  props: {
    popupVisible: {
      type: Boolean,
      value: false
    },
    logisticsInfo: {
      type: Object,
      value: () => { }
    }
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
    onClose() {
      this.$emit('onClose')
    },
    lookLogistics(e) {

      let { item } = e.currentTarget.dataset
      this.$emit('onClose')
      wx.$router.push({
        url: `/pages/mine/orderDetail/logisticsDetails/index?code=${item.deliveryNo}&name=${this.data.logisticsInfo.expName}`,
      })
      // wx.$toast('查看物流')
    },
  }
})
