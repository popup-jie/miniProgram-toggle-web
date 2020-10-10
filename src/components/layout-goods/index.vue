<template>
  <div class="components-class">
    <!-- html -->
  </div>
</template>

<script>
  export default {}
</script>


<style lang='scss'>
  @import '../../static/scss/common.scss';

.columns-wrapper {
  position: relative;

  .columns-title {
    font-size: 32px;
    color: $levelTile;
  }

  .columns-desc {
    margin-top: 18px;
    color: $auxiliaryColor;
    font-size: 22px;
  }

  .columns-control {
    &.bottom {
      position: absolute;
      bottom: 0;
      left: 0;
    }

    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    align-content: center;

    .price {
      color: #ff3631;
      font-size: 32px;
      .symbol {
        font-size: 26px;
        display: inline-block;
      }
    }
    .add {
      width: 40px;
      height: 40px;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .image-wrapper {
    background: $baseColor;
    overflow: hidden;
    width: 240px;
    height: 240px;
    image {
      height: 100%;
    }
  }
}

.two-columns,
.floor-banner,
.scroll-columns {
  width: 670px;
  display: flex;
  margin: 0 auto;
}

.floor-banner {
  padding: 20px;
  height: 280px;
  margin: 0 auto 0;
  border: 1px solid rgba(237, 237, 237, 1);
  border-radius: $borderRorderHalf;
  .image-wrapper {
    width: 240px;
    height: 240px;
    border-radius: 4px;
    margin-right: 20px;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .columns-wrapper {
    width: 368px;
  }
}

.two-columns {
  display: flex;
  justify-content: space-between;
  // padding: 0;
  flex-wrap: wrap;
  .image-wrapper {
    width: 320px;
    height: 320px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .columns-wrapper {
    width: 320px;
    margin-bottom: 30px;
    .columns-desc {
      margin-top: 20px;
    }

    .columns-control {
      margin-top: 20px;
    }
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    &:nth-last-child(2) {
      margin-bottom: 0;
    }
  }
}

.scroll-columns {
  margin: 0 auto 0;
  scroll-view {
    white-space: nowrap;
    height: 416px;
  }
  .columns-wrapper {
    display: inline-block;
    width: 240px;
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }

    .image-wrapper {
      border-radius: 8px;
    }

    .columns-title {
      margin-top: 20px;
    }

    .columns-desc {
      margin-top: 20px;
    }

    .columns-control {
      margin-top: 20px;
    }
  }
}

</style>
