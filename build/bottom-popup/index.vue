<template>
  <div class="components-class">
    <div class="custom-class">
      <van-popup
        :show="show"
        @close="onClose"
        position="bottom"
        custom-class="bottom-popup"
        :custom-style="'max-height:' + height + '%;'"
      >
        <slot name="title" v-if="useTitleSlot"> </slot>
        <div class="title" v-else :style="titleStyle">
          {{ title }}
          <img
            src="/images/search_shut.png"
            class="closeIcon"
            @click="onClose()"
          />
        </div>
        <slot> </slot>
        <slot name="footer" v-if="useFooterSlot"> </slot>
        <div class="footer" v-else>
          <van-button round custom-class="saveBtn" @click.stop="saveHandle()">
            {{ comfirmText || '确认' }}
          </van-button>
        </div></van-popup
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    show: Boolean,
    useTitleSlot: Boolean,
    useFooterSlot: Boolean,
    comfirmText: String,
    height: {
      type: Number,
      default: 60,
    },
    titleStyle: String,
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
    onClose() {
      this.$emit('onClose');
    },
    saveHandle() {
      this.$emit('comfirmHandle');
    },
  },
};
</script>


<style lang='scss'>
@import '@scss/common.scss';

.bottom-popup {
  border-radius: 20px 20px 0px 0px;
  padding: 0 40px;
  .title {
    font-size: 38px;
    color: #333;
    padding-top: 58px;
    text-align: center;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    padding-bottom: 30px;
    .closeIcon {
      position: absolute;
      right: 30px;
      width: 40px;
      height: 40px;
    }
  }
  // .van-popup__close-icon--top-right {
  //   top: 66px;
  //   width: 44px;
  //   height: 44px;
  //   background: #f5f5f5;
  //   border-radius: 50%;
  // }

  .footer {
    .saveBtn {
      width: 670px;
      height: 80px;
      line-height: 80px;
      background: #a5d50c;
      border-radius: 40px;
      color: #fff;
      font-size: 30px;
      margin: 30px auto;
      border: 0;
      display: block;
    }
  }
}
</style>
