// components/choose-courier/index.js
import { ybfComponent } from '../common/index'

import {dd} from '@api/dd'

ybfComponent({
  props: {
    isDefault: Object,
    isShowRightIcon: Boolean,
    showTag: {
      type: Boolean,
      value: false
    }
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
    clickAddress() {
      this.$emit('clickAddress', this.data.isDefault)
    }
  }
})
