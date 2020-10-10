<template>
  <div class="components-class">
    <wxs src="../../utils/common.wxs" module="utils" />
<view class="goods-list custom-class">
  <view class="goods-image">
    <image src="{{images || '/images/pro_s.png' }}" lazy-load />
  </view>
  <view class="goods-info-wrapper">
    <view class="goods-info-top">
      <view class="goods-info-header">
        <view class="goods-title">{{title || '益生君益生君益生君' }}</view>
        <view class="goods-price">￥{{utils.toDecimal2(subtotal || '18')}}</view>
      </view>
      <view class="goods-info-sku">
        <view class="goods-info-sku-spec">
          <view wx:for="{{spec}}" wx:key="*this">{{item.name}}：{{item.value}}</view>
          <view wx:if="{{stringSpec && spec.length == 0}}">{{stringSpec}}</view>
          <!-- <text wx:for="{{spec}}" wx:key="*this">{{item}}</text> -->
          <!-- {{spec || '玫瑰味 20盒' }} -->
        </view>
        <view class="goods-info-sku-count">x{{count || '100' }}</view>
      </view>
    </view>
    <view class="goods-info-bottom">
      <view class="price">
        <text class="red">￥</text>
        <text>{{utils.toDecimal2(total || '1999')}}</text>
      </view>
      <view>
        <slot name="priceExtra"></slot>
      </view>
    </view>
  </view>
</view>
  </div>
</template>

<script>
  
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
      value: () => { }
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
  methods: {
  }
}
</script>


<style lang='scss'>
  @import '../../static/scss/common.scss';

.goods-list {
  padding: 0 20px;
  margin: 30px 0 0 0;
  display: flex;
  .goods-image {
    width: 200px;
    height: 200px;
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
    padding: 8px 0;
    .goods-info-top {
      .goods-info-header {
        display: flex;
        justify-content: space-between;
        .goods-title {
          font-size: 26px;
          color: $levelTile;
        }
        .goods-price {
          font-size: 26px;
          color: $levelTile;
        }
      }
      .goods-info-sku {
        margin-top: 8px;
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
        font-size: 32px;
        color: #ff3631;
        .red {
          font-size: 26px;
        }
      }
    }
  }
}

</style>
