<template>
  <div class="components-class">
    <div  class="isDefaultAddress-info custom-class" @click.stop="clickAddress()"><div  class="icon-wrapper"><img  src="/images/address_icon.png" lazy-load /></div><div  class="info-text"><div  class="user-info"><div  class="user-name van-ellipsis">{{isDefault.realName || '-'}}</div><div  class="user-phone van-ellipsis">{{ isDefault.phone }}</div></div><div  class="user-address">
      {{ isDefault.province }}{{ isDefault.city }}{{ isDefault.district }}{{ isDefault.detail }}
    </div></div><div  class="right-icon" v-show="!!isShowRightIcon"><van-icon  name="arrow" custom-class="icon"></van-icon></div></div>
  </div>
</template>

<script>
  import utils from "../../utils/common.wxs";

export default {
  props: {
    isDefault: Object,
    isShowRightIcon: Boolean,
    showTag: {
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
    clickAddress() {
      this.$emit('clickAddress', this.data.isDefault);
    }
  }
};
</script>


<style lang='scss'>
  @import '@scss/common.scss';

.isDefaultAddress-info {
  width: $containerWidth;
  background: #fff;
  margin: 0 auto 0;
  border-radius: $borderRorder;
  padding: 50px 40px;
  display: flex;
  align-items: center;
  align-content: center;
  min-height: 170px;
  .tag {
    background: rgba(71, 209, 182, 1);
    border-radius: 4px;
    font-size: 22px;
    font-weight: bold;
    // width: 66rpx;
  }
  .icon-wrapper {
    width: 34px;
    height: 42px;
    // background: red;
    margin-right: 30px;
    image {
      width: 34px;
      height: 42px;
    }
  }
  .info-text {
    flex: 1;
    .user-info {
      // width: 100%;
      @include clearfix();
      line-height: 44px;
      .tag {
        background: rgba(71, 209, 182, 1);
        border-radius: 4px;
        font-size: 22px;
        font-weight: bold;
        margin-right: 10px;
        float: left;
      }
      .user-name {
        margin: 0 13px 0 0;
        color: $levelTile;
        font-size: 32px;
        font-weight: bold;
        max-width: 316px;
        float: left;
      }
      .user-phone {
        font-weight: bold;
        color: $levelTile;
        font-size: 26px;
        max-width: 39%;
        float: left;
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
  .right-icon {
    margin-left: 20rpx;
    // width: 80rpx;
  }
  .icon {
    font-size: 30px;
    // margin-left: 20px;
    color: #666;
  }
}

</style>
