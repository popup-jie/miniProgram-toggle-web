<template>
  <div class="components-class">
    <div  class="floor-banner custom-class" @click.stop="lookDetail(item)"><div  class="image-wrapper"><img :src="item.image0 || '/images/pro.png'" lazy-load /></div><div  class="columns-wrapper"><div  class="columns-title van-ellipsis">{{ item.goodsName }}</div><div  class="columns-desc van-ellipsis">{{ item.goodsInfo }}</div><div  class="columns-control bottom"><div  class="price" v-if="showPrice"><span  class="symbol">￥</span><span >{{ utils.toDecimal2(item.priceRange || '0') }}</span></div></div></div></div><slot  name="footer"></slot>
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
    lookDetail(e) {
      this.$emit('lookDetail', this.data.item);
    }
  },
  beforeCreate() {
    console.log(this.data.item);
  }
};
</script>


<style lang='scss'>
  <!-- style -->
</style>
