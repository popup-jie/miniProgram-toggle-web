<template>
  <div class="components-class">
    <div  class="goods-list custom-class"><div  class="goods-image"><img :src="images" mode="aspectFit" lazy-load />
</div>
<div  class="goods-info-wrapper"><div  class="goods-info-top"><div  class="goods-info-header"><div  class="goods-title van-ellipsis">{{title || '益生君益生君益生君' }}</div>
</div>
<div  class="goods-info-sku"><div  class="goods-info-sku-spec"><div  v-for="(item, index) in spec" :key="index">{{item.name}}：{{item.value}}</div>
<div  v-if="stringSpec && spec.length == 0">{{stringSpec}}</div>
</div>
</div>
</div>
<div  class="goods-info-bottom"><div  class="price"><span  class="red">¥</span>
<span >{{utils.toDecimal2(subtotal || '1999')}}</span>
</div>
<div  class="price-count">x{{count || '100' }}</div>
</div>
</div>
</div>
  </div>
</template>

<script>
  import utils from "../../utils/common.wxs";
export default {
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
      default: []
      // { title: '玫瑰盒', value: 20 }

    },
    // 规格字符串
    stringSpec: {
      type: String,
      default: ''
    },
    // 数量
    count: String,
    // 总计
    total: String
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {};
  },

  /**
   * 组件的方法列表
   */
  methods: {}
};
</script>


<style lang='scss'>
  @import '../../static/scss/common.scss';

.goods-list {
  padding: 30px 0;
  margin: 0;
  display: flex;
  .goods-image {
    width: 160px;
    height: 160px;
    background: $baseColor;
    overflow: hidden;
    border-radius: $borderRorder;
    margin-right: 20px;
    image {
      width: 100%;
      height: 100%;
    }
  }
  .goods-info-wrapper {
    flex: 1;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    padding: 7px 0;
    .goods-info-top {
      .goods-info-header {
        display: flex;
        justify-content: space-between;
        .goods-title {
          font-size: 30px;
          color: #333333;
        }
        .goods-price {
          font-size: 26px;
          color: $levelTile;
        }
      }
      .goods-info-sku {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 22px;
        color: #999;
      }
    }
    .goods-info-bottom {
      display: flex;
      justify-content: space-between;
      .price {
        padding: 0;
        font-size: 30px;
        color: #333333;
        // .red {
        //   font-size: 26px;
        // }
      }
      .price-count {
        font-size: 28px;
        color: #999999;
      }
    }
  }
}

</style>
