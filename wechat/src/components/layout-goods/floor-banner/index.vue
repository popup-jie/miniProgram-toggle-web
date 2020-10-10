<template>
  <div class="components-class">
    <wxs src="../../../utils/common.wxs" module="utils" />
<!-- 楼层banner -->
<view class="floor-banner custom-class" catch:tap="lookDetail" data-item="{{item}}">
  <view class="image-wrapper">
    <!-- mode="aspectFit" -->
    <image src="{{item.image0 || '/images/pro.png' }}" lazy-load />
  </view>
  <view class="columns-wrapper">
    <view class="columns-title van-ellipsis">{{ item.goodsName }}</view>
    <view class="columns-desc van-ellipsis">{{ item.goodsInfo }}</view>
    <view class="columns-control bottom">
      <view class="price" wx:if="{{showPrice}}">
        <text class="symbol">￥</text>
        <text>{{ utils.toDecimal2(item.priceRange || '0') }}</text>
      </view>
      <!-- <view class="add"> -->
      <!-- <image src="/images/add_icon.png" /> -->
      <!-- </view> -->
    </view>
  </view>
</view>
<slot name="footer"></slot>
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
    item: Object,
    showPrice: {
      type: Boolean,
      value: true
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
    lookDetail(e) {
      this.$emit('lookDetail', this.data.item)
    }
  },
  created() {
    console.log(this.data.item)
  }
}
</script>


<style lang='scss'>
  <!-- style -->
</style>
