<template>
  <div class="components-class">
    <div  class="scroll-columns"><scroll-div  scroll-x><div  class="columns-wrapper" v-for="(item, index) in list" @click.stop="lookDetail(item)" :key="index"><div  class="image-wrapper"><img :src="item.image0" lazy-load mode="aspectFit" /></div><div  class="columns-title van-ellipsis">{{ item.goodsName }}</div><div  class="columns-control"><div  class="price van-ellipsis"><block  v-for="(price, index) in item.priceRange" :key="index"><span  class="symbol">¥</span><span >{{price || '0'}}</span><span  v-if="item.priceRange.length > 1 && index == 0"> -</span></block></div></div></div></scroll-div></div>
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
