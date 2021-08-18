<template>
  <div class="components-class">
    <div class="scroll-columns">
    <scroll-div scroll-x :style="`height: ${scrollViewHeight}px`" :class="`${showBtn ? 'heightS' : ''}`">
    <div class="columns-wrapper" v-for="(item, index) in list" @click.stop="lookDetail({item:item})" :data-item="item" :key="index">
    <div class="image-wrapper">
    <img :src="item.image0" lazy-load mode="aspectFit" />
    </div>
<div class="columns-title van-ellipsis">
    {{ item.goodsName }}</div>
<div class="columns-freeShipping-tag" v-if="isFreeShippingAll">
    包邮</div>
<div :class="`columns-control ${isFreeShippingAll ? 'freeShipping': ''}`">
    <div class="price van-ellipsis">
    <block v-for="(price, index) in item.priceRange" :key="index">
    <span class="symbol">
    ¥</span><span>
    {{ utils.toDecimal2(price || '0') }}</span><span v-if="item.priceRange.length > 1 && index == 0">
    -</span></block>
</div>
</div>
<div class="add" v-if="showBtn" @click.stop="btnHandle({item:item})" :data-item="item">
    <div :class="btn btnClass">
    {{btnText}}</div>
</div>
</div>
</scroll-div>
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
    list: Array,
    btnText: {
      type: String,
      default: '去购买'
    },
    btnClass: String,
    showBtn: {
      type: Boolean,
      default: false

    }
  },

  /**
   * 组件的初始数据
   */
  data() {
    return {
      scrollViewHeight: 0,
      isFreeShippingAll: false
    };
  },

  mounted() {
    // 获取顶部信息元素大小，计算滚动需要使用到
    const query = this.createSelectorQuery();
    query.select('.columns-wrapper').boundingClientRect();
    query.exec(res => {
      this.scrollViewHeight = res[0].height;

      //  this._topHeight = res[0].height + res[0].top - navHeight - 60
      this.isFreeShippingAll = getApp().globalData.isFreeShippingAll;
    });
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
