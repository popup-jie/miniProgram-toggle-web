import { ybfComponent } from '../common/index'

import { cc, dc } from '../common/index'
import dd from '@utils/utils'

ybfComponent({

  properties: {
    string: {
      type: String,
      value: '1'
    },
    boolean: {
      type: Boolean,
      value: false,
    },
    number: {
      type: Number,
      value: 1
    },
    array: {
      type: Array,
      value: []
    },
    object: {
      type: Object,
      value: () => { },
      observer(newVal) {
        if (Array.isArray(newVal)) {
          this.setData({
            chooseValue: newVal[0] || {},
            b: 1
          }, () => {
            wx.$router.go(-1)
          })
        }
      }
    },
    dataColumns: {
      type: Array,
      value: [],
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    a: 1,
    b: 1
  },


  methods: {
    test() {
      this.setData({
        a: 8
      })

      var d = {
        d: {
          ff() {
          }
        }
      }
    },
    observer() {
      console.log('11')
    },
    dd({ env }) {
      console.log(env)
    },
    cc(env = false) {
      console.log(env)
    }
  }
})
