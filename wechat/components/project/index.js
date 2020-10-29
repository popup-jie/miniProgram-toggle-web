import {
  ybfComponent
} from '../common/index'
ybfComponent({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  props: {
    // 数据对象
    item: {
      type: Object,
      value: () => {}
    },

    items: {
      type: Array,
      // value： {}
      value: () => []
    },

    // 图片
    images: String,
    // 标题
    title: String,
    // 单价
    subtotal: String,
    // 规格
    spec: {
      type: Array,
      value: []
      // { title: '玫瑰盒', value: 20 }
    },
    // 规格字符串
    stringSpec: {
      type: String,
      value: ''
    },
    // 数量
    count: String,
    // 总计
    total: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {}
})