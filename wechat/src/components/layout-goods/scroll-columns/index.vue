<template>
  <div class="components-class">
    <wxs src="../../../utils/common.wxs" module="utils" />
<view class="scroll-columns">
  <scroll-view scroll-x>
    <view class="columns-wrapper" wx:for="{{list}}" catch:tap="lookDetail" data-item="{{item}}">
      <view class="image-wrapper">
        <image src="{{item.image0 || '/images/pro.png' }}" lazy-load />
      </view>
      <view class="columns-title van-ellipsis">{{ item.goodsName }}</view>
      <view class="columns-desc van-ellipsis">{{ item.goodsInfo }}</view>
      <view class="columns-control">
        <view class="price">
          <text class="symbol">￥</text>
          <text>{{ utils.toDecimal2(item.priceRange || '0') }}</text>
        </view>
        <!-- <view class="add">
          <image src="/images/add_icon.png" />
        </view> -->
      </view>
    </view>
    <!-- <view class="columns-wrapper">
      <view class="image-wrapper">
        <image src="/images/pro_s.png" />
      </view>
      <view class="columns-title van-ellipsis">益生君益生君益生君益生君益生君益生君益生君益生君</view>
      <view class="columns-desc van-ellipsis">产品介绍123产品介绍123产品介绍123产品介绍123产品介绍123</view>
      <view class="columns-control">
        <view class="price">
          <text class="symbol">￥</text>
          <text>168.00</text>
        </view>
        <view class="add">
          <image src="/images/add_icon.png" />
        </view>
      </view>
    </view>
    <view class="columns-wrapper">
      <view class="image-wrapper">
        <image src="/images/pro_s.png" />
      </view>
      <view class="columns-title van-ellipsis">益生君益生君益生君益生君益生君益生君益生君益生君</view>
      <view class="columns-desc van-ellipsis">产品介绍123产品介绍123产品介绍123产品介绍123产品介绍123</view>
      <view class="columns-control">
        <view class="price">
          <text class="symbol">￥</text>
          <text>168.00</text>
        </view>
        <view class="add">
          <image src="/images/add_icon.png" />
        </view>
      </view>
    </view> -->
  </scroll-view>
</view>
  </div>
</template>

<script>
  
export default {
  /**
   * 组件的属性列表
   */
  props: {
    list: Array
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
      const item = e.currentTarget.dataset.item
      this.$emit('lookDetail', item)
    }
  }
}
</script>


<style lang='scss'>
  <!-- style -->
</style>
