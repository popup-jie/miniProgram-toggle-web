<template>
  <div class="components-class">
    <bottom-popup :show="show" @onclose="popUpOnClose" custom-class="popup-wrapper":title="title":comfirmtext="comfirmText" @comfirmhandle="saveHandle"><div ><van-picker :columns="dataColumns" value-key="name" visible-item-count="4" column-class="pickerNormal" active-class="pickerActive" @change="onChange"></van-picker></div></bottom-popup>
  </div>
</template>

<script>
  import bottomPopup from '@components/bottom-popup/index';
export default {
  props: {
    show: {
      type: Boolean
    },
    title: {
      type: String,
      default: ''
    },
    comfirmText: {
      type: String,
      default: '确定'
    },
    dataColumns: {
      type: Array,
      default: []
    }
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {
      chooseValue: {}
    };
  },

  mounted() {
    // if (Array.isArray(this.data.dataColumns)) {
    //   this.setData({
    //     chooseValue: this.data.dataColumns[0] || {}
    //   })
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    popUpOnClose() {
      this.$emit('close');
    },
    saveHandle() {
      this.$emit('comfirmHandle', this.data.chooseValue);
      this.popUpOnClose();
    },

    onChange(event) {
      const { picker, value, index } = event.detail;

      this.chooseValue = value;
    }
  },
  watch: {
    dataColumns: function (newVal) {
      if (Array.isArray(newVal)) {
        this.chooseValue = newVal[0] || {};
      }
    }
  },
  components: {
    bottomPopup: bottomPopup
  }
};
</script>


<style lang='scss'>
  @import '../../static/scss/common.scss';

.popup-title {
  color: red;
}
.popup-wrapper {
  // border-radius: 16px 16px 0px 0px !important;
  z-index: 10;
  .pickerActive {
    color: #A5D50C;
    font-size: 34px;
    font-weight: bold;
  }
  .van-picker__frame {
    &::after {
      border: 0;
    }
  }
  .pickerNormal {
    font-size: 28px;
    color: #DDD;
  }
}

</style>
