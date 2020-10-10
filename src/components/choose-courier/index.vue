<template>
  <div class="components-class">
    <van-popup :show="show" @close="popUpOnClose" position="bottom" round custom-class="popup-wrapper" closeable><div  class="popup-title">请选择配送方式</div><van-picker :columns="dataColumns" value-key="expName" visible-item-count="4" column-class="pickerNormal" active-class="pickerActive" @change="onChange"></van-picker><van-button  round custom-class="saveBtn" @click.stop="saveHandle()">确定</van-button></van-popup>
  </div>
</template>

<script>
  import floorBanner from '@components/layout-goods/floor-banner/index';
import twoColumns from '@components/layout-goods/two-columns/index';
import scrollColumns from '@components/layout-goods/scroll-columns/index';
import detailSwiper from '@pages/details/component/swiper/swiper';


import { cc, dc } from '../common/index';
import dd from '@utils/utils';

export default {

  props: {
    string: {
      type: String,
      default: '1'
    },
    boolean: {
      type: Boolean,
      default: false

    },
    number: {
      type: Number,
      default: 1},
    array: {
      type: Array,
      default: []
    },
    object: {
      type: Object,
      value: () => {}
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
      a: 1,
      b: 1
    };
  },

  methods: {
    test() {
      this.a = 8;


      var d = {
        d: {
          ff() {}
        }
      };
    },
    observer() {
      console.log('11');
    },
    dd({ env }) {
      console.log(env);
    },
    cc(env = false) {
      console.log(env);
    }
  },
  watch: {
    object: function (newVal) {
      if (Array.isArray(newVal)) {
        this.chooseValue = newVal[0] || {};
        this.b = 1;

        wx.$router.go(-1);
      }
    }
  },
  components: {
    floorBanner: floorBanner,
    twoColumns: twoColumns,
    scrollColumns: scrollColumns,
    detailSwiper: detailSwiper
  }
};
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
