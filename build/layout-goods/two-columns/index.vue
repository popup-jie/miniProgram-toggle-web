<template>
  <div class="components-class">
    <div  class="two-columns"><div :class="columns-wrapper item.noBorder ? 'noBorder' : ''" v-for="(item, index) in forlist" @click.stop="lookDetail(item)" :key="index"><div  class="image-wrapper"><img :src="item.image0" lazy-load mode="aspectFit" />
</div>
<div  class="columns-title van-ellipsis">{{ item.goodsName }}</div>
<div  class="columns-desc van-ellipsis">{{ item.goodsInfo }}</div>
<div  class="columns-control"><div  class="price"><block  v-for="(price, index) in item.priceRange" :key="index"><span  class="symbol">¥</span>
<span >{{price || '0'}}</span>
<span  v-if="item.priceRange.length > 1 && index == 0">-</span>
</block>
</div>
<div  class="add"><div  class="btn">去购买</div>
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
    }

  },

  /**
   * 组件的初始数据
   */
  data() {
    return {
      forlist: []
    };
  },

  watch: {
    list: function (newVal) {
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
    }
  }
};
</script>


<style lang='scss'>
  <!-- style -->
</style>
