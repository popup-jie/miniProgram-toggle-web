<template>
  <div class="components-class">
    <div class="floor-banner-wrapper">
    <div class="floor-banner custom-class" @click.stop="lookDetail({item:item})" :data-item="item">
    <div class="image-wrapper">
    <img :src="item.image0" lazy-load mode="aspectFit" />
    </div>
<div class="columns-wrapper">
    <div class="columns-title van-ellipsis">
    {{ item.goodsName }}</div>
<div :class="columns-desc splitLine">
    {{ item.goodsInfo }}</div>
<div class="columns-freeShipping-tag" v-if="isFreeShippingAll">
    包邮</div>
<div class="columns-control bottom">
    <div class="price" v-if="showPrice">
    <block v-for="(price, index) in item.priceRange" :key="index">
    <span class="symbol">
    ¥</span><span>
    {{ utils.toDecimal2(price || '0')}}</span><span v-if="item.priceRange.length > 1 && index == 0">
    -</span></block>
</div>
<div class="add" @click.stop="btnHandle({item:item})" :data-item="item" v-if="showBtn">
    <div :class="btn btnClass">
    {{btnText}}</div>
</div>
</div>
</div>
</div>
</div>
<slot name="footer">
    </slot>

  </div>
</template>

<script>
  import utils from "../../../utils/common.wxs";
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
      default: true

    },
    btnClass: String,
    splitLine: {
      type: String,
      default: 'van-ellipsis'
      // value: 'van-multi-ellipsis--l3'

    },
    btnText: {
      type: String,
      default: '去购买'
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
      isFreeShippingAll: false
    };
  },

  mounted() {
    this.isFreeShippingAll = getApp().globalData.isFreeShippingAll;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lookDetail(e) {
      this.$emit('lookDetail', this.data.item);
    },

    btnHandle() {
      this.$emit('btnHandle', this.data.item);
    }
  },
  beforeCreate() {}
};
</script>


<style lang='scss'>
  <!-- style -->
</style>
