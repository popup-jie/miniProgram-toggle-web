<template>
  <div class="components-class">
    <wxs src="../../utils/common.wxs" module="utils" />
<view class="isDefaultAddress-info" catch:tap="clickAddress">
  <view class="icon-wrapper">
    <image src="/images/address_icon.png" lazy-load/>
  </view>
  <view class="info-text">
    <view class="user-info">
      <van-tag custom-class="tag" wx:if="{{showTag}}">默认</van-tag>
      <view class="user-name van-ellipsis">{{isDefault.realName || '-'}}</view>
      <view class="user-phone van-ellipsis">{{ isDefault.phone }}</view>
    </view>
    <view class="user-address">
      {{ isDefault.province }}{{ isDefault.city }}{{ isDefault.district }}{{ isDefault.detail }}
    </view>
  </view>
  <view class="right-icon" hidden="{{!isShowRightIcon}}">
    <van-icon name="arrow" custom-class="icon" />
  </view>
</view>
  </div>
</template>

<script>
  // components/choose-courier/index.js

import {dd} from '@api/dd'

export default {
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
}
</script>


<style lang='scss'>
  @import '@scss/common.scss';

.isDefaultAddress-info {
  width: $containerWidth;
  background: #fff;
  margin: 0 auto 0;
  border-radius: $borderRorder;
  padding: 30px 20px;
  display: flex;
  align-items: center;
  align-content: center;
  min-height: 170px;
  .tag {
    background: rgba(71, 209, 182, 1);
    border-radius: 4px;
    font-size: 22px;
    font-weight: bold;
  }
  .icon-wrapper {
    width: 60px;
    height: 60px;
    // background: red;
    margin-right: 20px;
    image {
      width: 60px;
      height: 60px;
    }
  }
  .info-text {
    flex: 1;
    .user-info {
      display: flex;
      align-items: center;
      align-content: center;
      .tag {
        background: rgba(71, 209, 182, 1);
        border-radius: 4px;
        font-size: 22px;
        font-weight: bold;
        margin-right: 10px;
      }
      .user-name {
        margin: 0 13px 0 0;
        color: $levelTile;
        font-size: 32px;
        font-weight: bold;
        max-width: 200px;
      }
      .user-phone {
        font-weight: bold;
        color: $levelTile;
        font-size: 26px;
        max-width: 200px;
      }
    }
    .user-address {
      font-size: 26px;
      color: #666;
      margin-top: 10px;
      word-break: break-word; /* 文本行的任意字内断开 */
      word-wrap: break-word; /* IE */
    }
  }
  .icon {
    font-size: 30px;
    margin-left: 20px;
    color: #666;
  }
}

</style>
