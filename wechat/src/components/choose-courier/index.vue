<template>
  <div class="components-class">
    <van-popup show="{{ show }}" bind:close="popUpOnClose" position="bottom" round custom-class="popup-wrapper" closeable>
  <view class="popup-title">请选择配送方式</view>
  <van-picker columns="{{ dataColumns }}" value-key="expName" visible-item-count="4" column-class="pickerNormal" active-class="pickerActive" bind:change="onChange"></van-picker>
  <van-button round custom-class="saveBtn" catch:tap="saveHandle">确定</van-button>
</van-popup>
  </div>
</template>

<script>
  // components/choose-courier/index.js


export default {

  props: {
    show: {
      type: Boolean,
      observe(newVal) {
        // this.setData({
        //   show: newVal,
        //   chooseValue: this.data.dataColumns[0]
        // })
      }
    },
    dataColumns: {
      type: Array,
      value: [],
      observer(newVal) {
        if (Array.isArray(newVal)) {
          this.setData({
            chooseValue: newVal[0] || {}
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chooseValue: {}
  },

  mounted() {
    // console.log('choose')
    if (Array.isArray(this.data.dataColumns)) {
      this.setData({
        chooseValue: this.data.dataColumns[0] || {}
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    popUpOnClose() {
      const value = false
      this.setData({
        show: value
      })
      this.$emit('close');
    },
    saveHandle() {
      this.$emit('selectValue', this.data.chooseValue)
      this.popUpOnClose()
    },

    onChange(event) {
      const { picker, value, index } = event.detail;

      this.setData({
        chooseValue: value
      })
    }
  },

  observers: {
    'dataColumns': function (newa, newb) {
      console.log(newa)
      console.log(newb)
    }
  }
}
</script>


<style lang='scss'>
  @import '../../static/scss/common.scss';

.popup-title {
  color: red;
}
.popup-wrapper {
  border-radius: 16px 16px 0px 0px !important;
  z-index: 10;
  .popup-title {
    height: 80px;
    line-height: 80px;
    color: $levelTile;
    font-size: 26px;
    font-weight: bold;
    margin-left: 40px;
  }
  .pickerActive {
    color: #47d1b6;
    font-size: 32px;
    font-weight: bold;
  }
  .van-picker__frame {
    &::after {
      border: 0;
    }
  }
  .pickerNormal {
    font-size: 26px;
    color: #999;
  }
  .saveBtn {
    width: 670px;
    height: 80px;
    line-height: 80px;
    background: linear-gradient(
      90deg,
      rgba(55, 190, 193, 1),
      rgba(81, 221, 173, 1)
    );
    border-radius: 40px;
    color: #fff;
    font-size: 32px;
    margin: 30px auto;
    border: 0;
    display: block;
  }
}

</style>
