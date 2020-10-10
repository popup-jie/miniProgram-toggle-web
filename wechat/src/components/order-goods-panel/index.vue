<template>
  <div class="components-class">
    <wxs src="../../utils/common.wxs" module="utils" />
<view class="goods-wrapper custom-class">
  <view class="panel-title">发货地：{{list.whName}}</view>
  <goods-project wx:for="{{list.item}}" wx:for-item="goods" wx:key="*this" 
  images="{{goods.images}}" 
  title="{{goods.title}}" 
  subtotal="{{goods.subtotal}}" 
  stringSpec="{{goods.stringSpec}}" 
  spec="{{goods.spec}}" 
  count="{{goods.count}}"
  total="{{goods.total}}">
  </goods-project>
  <van-cell-group custom-class="goods-remark">
    <!-- 快递如何实现 -->
    <van-cell title="选择快递" value="{{list.courier.expName || '请选择配送方式'}}" title-class="title" custom-class="price" value-class="value" is-link="{{ isEdit }}" catch:tap="chooseCourier" />
    <van-cell title="快递运费" title-class="title" custom-class="price" value-class="value">
      <text>￥</text>
      <text>{{utils.toDecimal2(list.courier.courierAllPrice || 0)}}</text>
    </van-cell>
    <slot></slot>
  </van-cell-group>
</view>
  </div>
</template>

<script>
  // components/choose-courier/index.js

export default {
  
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
}
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
