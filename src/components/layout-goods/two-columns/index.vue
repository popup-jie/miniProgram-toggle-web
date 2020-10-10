<template>
  <div class="components-class">
    <div  class="two-columns"><div  class="columns-wrapper" v-for="(item, index) in list" @click.stop="lookDetail(item)" :key="index"><div  class="image-wrapper"><img :src="item.image0 || '/images/pro.png'" lazy-load /></div><div  class="columns-title van-ellipsis">{{ item.goodsName }}</div><div  class="columns-desc van-ellipsis">{{ item.goodsInfo }}</div><div  class="columns-control"><div  class="price"><span  class="symbol">￥</span><span >{{ utils.toDecimal2(item.priceRange || '0') }}</span></div></div></div></div>
  </div>
</template>

<script>
  import utils from "../../../utils/common.wxs";
export default {
  /**
   * 组件的属性列表
   */
  props: {
    list: Array
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
    lookDetail(e) {
      const item = e.currentTarget.dataset.item;
      this.$emit('lookDetail', item);
    }
  }
};
</script>


<style lang='scss'>
  <!-- style -->
</style>
