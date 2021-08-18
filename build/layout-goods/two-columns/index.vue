<template>
  <div class="components-class">
    <div class="two-columns">
    <div :class="`columns-wrapper ${item.noBorder ? 'noBorder' : ''}`" v-for="(item, index) in forlist" @click.stop="lookDetail({item:item})" :data-item="item" :key="index">
    <div class="image-wrapper">
    <img :src="item.image0" lazy-load mode="aspectFit" />
    </div>
<div class="columns-title van-ellipsis">
    {{ item.goodsName }}</div>
<div class="columns-desc van-ellipsis">
    {{ item.goodsInfo }}</div>
<div class="columns-freeShipping-tag" v-if="isFreeShippingAll">
    包邮</div>
<div :class="`columns-control ${isFreeShippingAll ? 'freeShipping': ''}`">
    <div class="price">
    <block v-for="(price, index) in item.priceRange" :key="index">
    <span class="symbol">
    ¥</span><span>
    {{ utils.toDecimal2(price || '0') }}</span><span v-if="item.priceRange.length > 1 && index == 0">
    -</span></block>
</div>
<div class="add" @click.stop="btnHandle({item:item})" :data-item="item" v-if="showBtn">
    <img src="/images/details/shopping_shopping_icon@2x.png" v-if="btnIsImage" />
    <div :class="btn btnClass" v-else>
    {{btnText}}</div>
</div>
</div>
</div>
</div>

  </div>
</template>

<script>
  import utils from "../../../utils/common.wxs";
export default {
  /**
   * 组件的属性列表
   */
  props: {
    list: {
      type: Array,
      default: []
    },
    btnClass: String,
    btnText: {
      type: String,
      default: '去购买'
    },
    btnIsImage: {
      type: Boolean,
      default: false

    },
    showBtn: {
      type: Boolean,
      default: true

    }
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {
      forlist: [],
      isFreeShippingAll: false
    };
  },

  mounted() {
    this.isFreeShippingAll = getApp().globalData.isFreeShippingAll;
  },

  watch: {
    list: function (newVal) {
      if (newVal.length <= 0) return;
      if (newVal.length % 2 == 0) {
        newVal[newVal.length - 1].noBorder = true;
        newVal[newVal.length - 2].noBorder = true;
      } else if (newVal.length % 2 == 1) {
        newVal[newVal.length - 1].noBorder = true;
      }
      this.forlist = newVal;
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lookDetail(e) {
      const item = e.currentTarget.dataset.item;
      this.$emit('lookDetail', item);
    },
    btnHandle(e) {
      const item = e.currentTarget.dataset.item;
      this.$emit('btnHandle', item);
    }
  }
};
</script>


<style lang='scss'>
  <!-- style -->
</style>
