<template>
  <div class="components-class">
    <van-popup  round z-index="100" class="sharePopUp" position="bottom" closeable:show="show" @close="onClose"><div  class="con"><div  class="h3_title"><span >选择分享方式</span></div><div  class="shareType"><div  class="ul"><div  class="li"><block  v-if="!userLogin"><button  @getuserinfo="getUserInfo" open-type="getUserInfo" class="saveBtn"><div  class="li_top"><img  src="/images/merchant/pop_share_img@2x.png" /></div><div  class="li_bottom"><span >保存二维码图片</span></div></button></block><block  v-if="userLogin"><button  @click="createShareImage()"><div  class="li_top"><img  src="/images/merchant/pop_share_img@2x.png" /></div><div  class="li_bottom"><span >保存二维码图片</span></div></button></block></div><div  class="li"><button  open-type="share"><div  class="li_top"><img  mode="widthFix" src="/images/merchant/pop_share_applets@2x.png" /></div><div  class="li_bottom"><span >分享小程序</span></div></button></div></div></div></div></van-popup><sharebox  @onsuccess="shareOnSuccess" type="2" id="shareBox"></sharebox>
  </div>
</template>

<script>
  import shareBox from '@pages/details/component/shareBox/shareBox';

let app = getApp();
export default {
  props: {
    detailsObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      // 这里是一些组件内部数据
      show: false,
      userInfo: null,
      userLogin: false,
      qrCode: ''
    };
  },

  options: {
    addGlobalClass: true
  },
  methods: {
    shareOnSuccess() {
      this.isActive(false);
    },
    createShareImage() {
      this.selectComponent("#shareBox").isActive(true, this.data.qrCode);
    },
    getUserInfo(e) {
      app.wxLogon(e, userInfo => {
        this.userInfo = userInfo;
        this.userLogin = app.getUserLogin();

        this.createShareImage();
      });
    },
    // 方法
    onClose() {
      this.isActive(false);
    },
    isActive(flag = false, qrCode) {
      this.show = flag;

      if (flag) {
        this.setUserLogin();
      }
      if (qrCode) {
        this.qrCode = qrCode;
      }
    },
    setUserLogin() {
      let userInfo = app.getYbfUserInfo(); // 只是让 globalData.ybfUserInfo有值
      console.log('userInfo', userInfo);
      this.userLogin = app.getUserLogin();

      console.log('userLogin', this.data.userLogin);
    }
  },

  beforeCreate() {
    this.setUserLogin();
  },
  components: {
    shareBox: shareBox
  }
};
</script>


<style lang='scss'>
  .sharePopUp {
  width: 100%;
  height: 100%;

  .con {
    width: 100%;
    min-height: 200rpx;
    padding: 30rpx;

    .h3_title {
      text-align: center;
      margin: 20rpx auto 0;
    }

    .qrCode {
      width: 100%;
      height: auto;

      .code {
        width: 240rpx;
        height: 240rpx;
        border: 20rpx solid #f5f5f5;
        margin: 20rpx auto 10rpx;
        border-radius: 50%;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .desc {
        font-size: 26rpx;
        color: #333333;
        text-align: center;
      }
    }

    .shareType {
      display: flex;
      justify-content: center;
      margin-top: 60rpx;
      margin-bottom: 20rpx;

      .ul {
        width: 400rpx;
        display: flex;
        justify-content: space-between;

        .li {


          .li_top {
            width: 130rpx;
            height: 130rpx;
            overflow: hidden;
            border-radius: 50%;
            background: #3EB135;
            margin: 0 auto 10rpx;

            image {
              width: 100%;
              height: 100%;
            }
          }

          .li_bottom {
            font-size: 26rpx;
            color: #333333;


          }

          button {
            width: auto;
            height: auto;
            line-height: 30rpx;
            font-size: 26rpx;
            color: #333333;
            background: transparent;
            margin: 0;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
