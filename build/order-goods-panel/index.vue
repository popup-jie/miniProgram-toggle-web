<template>
  <div class="components-class">
    <div  class="goods-wrapper custom-class"><div  class="panel-title"><div  class="flex">发货地：{{list.whName}}</div>
</div>
<block  v-for="(goods, index) in list.item" :key="index"><goods-project :custom-class="goods-project-list list.item.length - 1 == index ? 'noBorder': ''":images="goods.images":title="goods.title":subtotal="goods.subtotal":stringspec="goods.stringSpec":spec="goods.spec":count="goods.count":total="goods.total"><div  v-if="goods.logis.length > 0"><div  @click.stop="lookLogic()"><div  slot="priceExtra" class="looklogis">查看物流</div>
</div>
</div>
</goods-project>
</block>
<van-cell-group  custom-class="goods-remark"><block  v-if="showFooter"><van-cell  v-if="!isFreeShipping":border="false":value="list.courier.expName || '请选择配送方式'" title-class="title" custom-class="price" value-class="value":is-link="isEdit" @click.stop="chooseCourier()"><div  slot="title"><span >选择快递</span>
<span  class="tag">必填</span>
</div>
</van-cell>
<van-cell  wx:else:border="false" value="包邮" title-class="title" custom-class="price" value-class="value"><div  slot="title"><span >选择快递</span>
</div>
</van-cell>
<van-cell  title="快递运费" title-class="title" custom-class="price" value-class="value":border="false"><span >¥</span>
<span >{{utils.toDecimal2(list.courier.courierAllPrice || 0)}}</span>
</van-cell>
</block>
<slot ></slot>
</van-cell-group>
</div>
  </div>
</template>

<script>
  import utils from "../../utils/common.wxs";
import goodsProject from '@components/project/index';
export default {
  options: {
    multipleSlots: true
  },
  props: {
    // 快递是否可点
    isEdit: {
      type: Boolean,
      default: false

    },
    showFooter: {
      type: Boolean,
      default: true

    },
    // 数据对象
    list: Object,
    // 当前下标
    index: Number,
    // 是否包邮 默认为不包邮
    isFreeShipping: {
      type: Boolean,
      default: false

    }
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
    },
    lookLogic() {
      this.$emit('lookLogic', {
        list: this.data.list,
        index: this.data.index
      });
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
  padding: 50px 40px 20px;

  .panel-title {
    // padding: 20px;
    display: flex;
    flex-direction: column;
    // align-content: center;
    // align-items: center;
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    // border-bottom: 1px solid rgba(237, 237, 237, 1);
    .flex {
      display: flex;
      justify-content: space-between;
    }
    .green {
      color: #47d1b6;
    }
    .sendTime {
      margin-top: 4px;
    }
  }

  .goods-project-list {
    border-bottom: 1px solid #f0f0f0;
    &.noBorder {
      border: 0;
    }
  }

  .goods-remark {
    margin: 30px 0 0;
    .price {
      padding: 28px 0;
    }
    .title,
    .value {
      font-size: 28px;
      color: #333;
    }
    .tag {
      border: 1px solid #ff5332;
      border-radius: 4px;
      font-size: 22px;
      text-align: center;
      color: #ff5332;
      font-weight: bold;
      padding: 5px 10px;
      margin-left: 15px;
    }
    .price .value text {
      // color: #ff3631;
    }
    .price:after {
      left: 0;
    }

    &::after {
      border: 0;
    }
  }
}

</style>
