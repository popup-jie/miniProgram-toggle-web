<template>
  <div class="components-class">
    <bottom-popup :show="popupVisible" @onclose="onClose" titlestyle custom-class="popup-wrapper-logis" title="该订单被拆成以下包裹" use-footer-slot height="60"><scroll-div :scroll-y="true" style="height: 580rpx;"><div  class="popup-wrapper-list" v-for="(item, index) in logisticsInfo.deliveryLolgisticsList" :key="index"><div  class="popup-wrapper-list-header"><div  class="status">
          {{item.status == 1 ? '待发货' : item.status == 2 ? '拣货中':item.status == 3 ? '运输中':'已签收'}}
        </div><div  class="deliveryCode" v-if="item.status != 1">{{logisticsInfo.expName}}：{{item.deliveryNo}}</div></div><div  class="popup-wrapper-list-info"><div  class="allCount">共{{item.totalNum}}件商品</div><div  class="lookbtn" @click.stop="lookLogistics(item)" v-if="item.status != 1">查看物流</div></div><div  class="popup-wrapper-list-panel" v-for="(det, index) in item.ordersDetailList" :key="index"><div  class="list"><div  class="goods-images"><img :src="det.image" /><div  class="images-info">{{det.deliveryNum || det.num}}{{det.unit}}</div></div><div  class="goods-info"><div  class="goods-info-title van-ellipsis">{{det.goodsName}}</div><div  class="goods-info-skus">{{det.attuInfo}}</div></div></div></div></div></scroll-div></bottom-popup>
  </div>
</template>

<script>
  import bottomPopup from '@components/bottom-popup/index';
export default {
  /**
   * 组件的属性列表
   */
  props: {
    popupVisible: {
      type: Boolean,
      default: false

    },
    logisticsInfo: {
      type: Object,
      value: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {};
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose() {
      this.$emit('onClose');
    },
    lookLogistics(e) {

      let { item } = e.currentTarget.dataset;
      this.$emit('onClose');
      wx.$router.push({
        url: `/pages/mine/orderDetail/logisticsDetails/index?code=${item.deliveryNo}&name=${this.data.logisticsInfo.expName}`
      });
      // wx.$toast('查看物流')
    }
  },
  components: {
    bottomPopup: bottomPopup
  }
};
</script>


<style lang='scss'>
  .popup-wrapper-logis {
  scroll-view {
    // padding-top: 50px;
  }
}
.popup-wrapper-list {
  margin-bottom: 50px;
  .popup-wrapper-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    .status {
      font-size: 28px;
      color: #ff5332;
    }
    .deliveryCode {
      font-size: 26px;
      color: #999999;
    }
  }
  .popup-wrapper-list-info {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    .allCount {
      font-size: 26px;
      color: #999999;
    }

    .lookbtn {
      border: 1px solid #999999;
      min-width: 130px;
      height: 42px;
      font-size: 24px;
      border-radius: 42px;
      font-weight: 500;
      color: #666666;
      padding: 0 20px;
      text-align: center;
    }
  }

  .popup-wrapper-list-panel {
    margin-top: 20px;

    .list {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      align-content: center;
    }

    .goods-images {
      width: 130px;
      height: 130px;
      position: relative;
      background: #ffffff;
      image {
        width: 130px;
        height: 130px;
      }
      .images-info {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 36px;
        background: rgba(0, 0, 0, 0.2);
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
        line-height: 36px;
        text-align: center;
      }
    }
    .goods-info {
      margin-left: 20px;
      flex: 1;
      .goods-info-title {
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        width: 560px;
      }
      .goods-info-skus {
        margin-top: 20px;
        font-size: 24px;
        font-weight: 500;
        color: #999999;
      }
    }
  }
}

</style>
