export const basic = Behavior({
  methods: {
    $emit(...args) {
      this.triggerEvent(...args);
    },
    $goPage(e) {
      const {
        url,
        totype
      } = e.currentTarget.dataset
      if (totype == 'redirect' || totype == 'replace') {
        wx.$router.replace(url)
      } else if (totype == 'switchTab') {
        wx.$router.switchTab(url)
      } else if (totype == 'reLaunch') {
        wx.reLaunch({
          url
        })
      } else {
        wx.$router.push(url)
      }
    }
  }
})

