<template>
  <div class="components-class">
    <div  class="goods-wrapper custom-class"><div  class="panel-title">发货地：{{list.whName}}</div><goods-project  v-for="(goods, index) in list.item":images="goods.images":title="goods.title":subtotal="goods.subtotal":stringspec="goods.stringSpec":spec="goods.spec":count="goods.count":total="goods.total" :key="index"></goods-project><van-cell-group  custom-class="goods-remark"><van-cell  title="选择快递":value="list.courier.expName || '请选择配送方式'" title-class="title" custom-class="price" value-class="value":is-link="isEdit" @click.stop="chooseCourier()"><van-cell  title="快递运费" title-class="title" custom-class="price" value-class="value"><span >￥</span><span >{{utils.toDecimal2(list.courier.courierAllPrice || 0)}}</span></van-cell><slot ></slot></van-cell></van-cell-group></div>
  </div>
</template>

<script>
  import utils from "../../utils/common.wxs";
import goodsProject from '@components/project/index';
// components/choose-courier/index.js

export default {

  props: {
    isEdit: {
      type: Boolean,
      default: false

    },
    list: Object,
    index: Number
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {};
  },

  beforeCreate() {},

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
        });
      }
    }
  },
  components: {
    goodsProject: goodsProject
  }
};
</script>


<style lang='scss'>
  @import '@scss/common.scss';
.goods-wrapper {
  width: $containerWidth;
  background: #fff;
  margin: 20px auto 0;
  border-radius: $borderRorder;
  overflow: hidden;

  .panel-title {
    height: 70px;
    padding: 0 20px;
    line-height: 70px;
    font-size: 24px;
    color: #666;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }

  .goods-remark {
    margin: 30px 20px 0;
    .price {
      padding: 20px 0;
    }
    .title,
    .value {
      font-size: 26px;
      color: $levelTile;
    }
    .price .value text {
      color: #ff3631;
    }
    .price:after {
      left: 0;
    }
  }
}

</style>
