let app = getApp()
Component({
  properties: {
    detailsObj: {
      type: Object,
      value: {}
    }
  },
  data: {
    // 这里是一些组件内部数据
    show: false,
    userInfo: null,
    userLogin: false,
    qrCode: ''
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
      app.wxLogon(e, (userInfo) => {
        this.setData({
          userInfo: userInfo,
          userLogin: app.getUserLogin()
        }, () => {
          this.createShareImage();
        })
      })
    },
    // 方法
    onClose() {
      this.isActive(false);
    },
    isActive(flag = false, qrCode) {
      this.setData({
        show: flag
      })
      if (flag) {
        this.setUserLogin();
      }
      if (qrCode) {
        this.setData({
          qrCode: qrCode
        })
      }
    },
    setUserLogin() {
      let userInfo = app.getYbfUserInfo() // 只是让 globalData.ybfUserInfo有值
      console.log('userInfo', userInfo)
      this.setData({
        userLogin: app.getUserLogin()
      }, () => {
        console.log('userLogin', this.data.userLogin)
      })
    },
  },

  created() {
    this.setUserLogin()
  }
})