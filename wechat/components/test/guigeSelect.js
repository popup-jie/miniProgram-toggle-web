let app = getApp();
import {
  reportingSku,
  getBySkusCache
} from '../../../../api/shopCartModule.js'
import {
  verifySkusList,
  isBPro,
  curSkuObjInit
} from '../../../../utils/dataProcess.js'

import {
  intersect,
} from '../../../../utils/util.js'

import full_reduction from '../../../behaviorsModule/activityModule/full_reduction.js';

Component({
  behaviors: [full_reduction],
  properties: {
    detailsObj: {
      type: Object,
      value: {},
      observer(newVal, oldVal) { },
      productStatus: 1, // 1是正常 2是已售罄 
    },
    discountObj: {
      type: Object,
      value: {
        isAllDiscount: false,
        allDiscountNum: 1
      }
    }
  },
  data: {
    // 这里是一些组件内部数据
    show: false,
    quantity: 1,
    guigeIndex: 0, // 默认索引值
    type: 1, // 1规格确认 2是详情加入购物车 3是购物车选择规格, 4立即购买
    currentSkuObj: null,
    maxQuantity: 100,
    sourceSkuObj: null,
    selectListObj: {},
    selectButtonList: [

    ],
    isFreeShippingAll: false
  },
  options: {
    addGlobalClass: true
  },
  methods: {
    onUnloadInitData() {
      this.initializeData();
      this.setData({
        currentSkuObj: null,
        selectButtonList: [],
        sourceSkuObj: null,
        selectListObj: {}
      })
    },
    imgShow(e) {
      let img = e.currentTarget.dataset.img;
      wx.previewImage({
        current: img, // 当前显示图片的http链接
        urls: [img] // 需要预览的图片http链接列表
      })
    },
    getCurSkuShopCartListNumber(type = 1, skuObj) {
      let shopCartList = app.getShopCartList() || [];
      let skuShopNumber = 0;
      let shopSkuTotal = 0;
      shopCartList.forEach((value, index) => {
        value.skuList.forEach((childValue, childIndex) => {
          shopSkuTotal += childValue.quantity;
          if (type == 1) {
            if (this.data.currentSkuObj && (this.data.currentSkuObj.sku == childValue.skuObj.sku)) {
              skuShopNumber += childValue.quantity;
            }
          }

          if (type == 2) {
            if (skuObj && (skuObj.sku == childValue.skuObj.sku)) {
              skuShopNumber += childValue.quantity;
            }
          }

        })
      })
      return {
        skuShopNumber, // 当前sku库存
        shopSkuTotal // 购物车商品
      };
    },
    // 库存最大值超出
    maxReserveStock() {
      let quantity = this.data.quantity;
      // 当前商品最大库存
      let goodsMaxReserve = this.data.detailsObj.totalInventory;
      // 当前sku最大库存
      let skuReserveStock = this.data.currentSkuObj.reserveStock;
      // 当前购物车sku数据
      let skuShopNumber = this.getCurSkuShopCartListNumber().skuShopNumber || 0;
      let shopCartList = app.getShopCartList() || [];
      // 测试用的
      // this.data.detailsObj.isB = 1;
      if (this.data.currentSkuObj) {
        // 购物车当前sku同级的总数量
        let shopSkuTotal = this.getCurSpuChildSkuNumber(this.data.currentSkuObj, shopCartList) || 0;
        if (this.data.detailsObj.isB == 1 && isBPro(this.data.currentSkuObj)) {
          // sku isB==1 的判断总库存 sku isB==0判断当前库存
          // 最大库存差值
          let betweenTotal = goodsMaxReserve - shopSkuTotal;
          // sku库存差值
          let canBuyTotal = skuReserveStock - skuShopNumber;

          // 两者最小值
          let total = Math.min(betweenTotal, canBuyTotal);

          if (quantity > total) {
            wx.showToast({
              title: '店主库存不足',
              icon: 'none', // loading
              duration: 1500,
            })
            return false;
          }

        } else {
          if (this.data.type == 1 || this.data.type == 2 || this.data.type == 4) {
            if (quantity > skuReserveStock - skuShopNumber) {
              wx.showToast({
                title: '抱歉，当前商品库存不足，已在抓紧补货中！',
                icon: 'none', // loading
                duration: 1500,
              })
              return false;
            }
          }

          if (this.data.type == 3) {
            if (quantity > skuReserveStock) {
              wx.showToast({
                title: '抱歉，当前商品库存不足，已在抓紧补货中！',
                icon: 'none', // loading
                duration: 1500,
              })
              return false;
            }
          }

        }
      }



    },
    // 数量监听
    quantityChange(e) {
      this.setData({
        quantity: e.detail
      }, () => {
        if (e.detail > this.data.maxQuantity) {
          wx.showToast({
            title: '该商品不能购买更多哦',
            icon: 'none', // loading
            duration: 1500,
            mask: true
          })
        }
        this.triggerEvent('onQuantity', this.data.quantity)
        this.triggerFlagAndNumber();
        this.triggerFlagAndNumberGift();
      })
    },
    verify() {
      let skusList = JSON.parse(JSON.stringify(this.data.detailsObj.skusList));
      // 判断当前规格库存 isB==1 需要掉接口 匹配 reserveStock 跟当前库存的拿最小值
      if (this.data.currentSkuObj && this.maxReserveStock() == false) {
        return false;
      }

      if (this.data.currentSkuObj) {
        return true;
      }

      if (verifySkusList(skusList) == false) {
        let noSelctArr = [];
        skusList.forEach((value, index) => {
          value.isSelect = false;
          value.value.forEach((childValue, childIndex) => {
            if (childValue.isSelect) {
              value.isSelect = true;
            }
          })
          if (!value.isSelect) {
            noSelctArr.push(value.name)
          }
        })

        if (noSelctArr.length > 0) {
          app.showToast(`请选择(${noSelctArr.join('/')})`);
          return false;
        }
        return false;
      }
    },
    onJionType(type = 1) {
      this.setData({
        type: type
      }, () => {
        this.newConfirmButton();
      })
    },
    confirm() {
      this.onJionType();
    },
    getGuigeList() {
      let skusList = this.data.detailsObj.skusList;
      let returnList = [];
      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          if (childValue.isSelect) {
            let params = {
              name: value.name,
              value: childValue.value
            }
            returnList.push(params);
          }
        })
      })
      return returnList;
    },
    // 根据当前sku获取购物车数量
    getCurSkuShopCartListNumber_1(skuObj, shopCartList) {
      let skuShopNumber = 0;
      shopCartList.forEach((value, index) => {
        value.skuList.forEach((childValue, childIndex) => {
          if (skuObj.sku == childValue.skuObj.sku) {
            skuShopNumber += childValue.quantity;
          }
        })
      })
      return skuShopNumber;
    },
    getCurSpuChildSkuNumber(skuObj, shopCartList) {
      let spuChildSkuNumber = 0;
      shopCartList.forEach((value, index) => {
        if (value.goodsId == skuObj.goodsId) {
          value.skuList.forEach((childValue, childIndex) => {
            spuChildSkuNumber += childValue.quantity;
          })
        }
      })
      return spuChildSkuNumber;
    },
    // 根据  {key:value} 找出当前sku，并看一下库存和当前购物车数量
    attrsListPushFlag(attrsJson, shopCartList) {
      let skus = this.data.detailsObj.skus;
      let skuObj = null;
      skus.forEach((value, index) => {
        if (wx.$utils.ifObjectValueEqual(attrsJson, value.attrsJson)) {
          skuObj = value;
        }
      })
      if (skuObj) {
        let skuShopNumber = this.getCurSkuShopCartListNumber_1(skuObj, shopCartList) || 0;
        if (skuShopNumber > skuObj.reserveStock) {

          return false;
        }
      }
      return true;
    },
    getSkuId(childValue) {
      let guigeList = this.getGuigeList();
      let skus = this.data.detailsObj.skus;
      let attrsJson = {};
      let skuObj = null;
      guigeList.forEach((value, index) => {
        attrsJson[value.name] = value.value;
      })

      if (childValue) {
        attrsJson[childValue.parentName] = childValue.value;
      }

      skus.forEach((value, index) => {
        if (wx.$utils.ifObjectValueEqual(attrsJson, value.attrsJson)) {
          skuObj = value;
        }
      })
      return skuObj;
    },
    newConfirmButton() {
      if (this.verify() == false) {
        return false;
      }


      let postParams = {
        goodsId: this.data.detailsObj.id,
        goodsCode: this.data.detailsObj.goodsCode,
        guigeList: this.getGuigeList(),
        quantity: this.data.quantity,
        skuObj: this.getSkuId(),
      }

      let params = JSON.parse(JSON.stringify(postParams))

      if (!params.skuObj) {
        wx.showToast({
          title: '未找到该规格,请重新选择规格',
          icon: 'none', // loading
          duration: 1500,
          mask: true
        })
        let skusList = this.data.detailsObj.skusList || [];
        this.setDisabledFalse(skusList);
        return false;
      }

      // 新增加的 postSkuObj 字段

      params.postSkuObj = params.skuObj.postSkuObj;
      delete params.skuObj.postSkuObj;

      console.log('添加购物车数据', JSON.parse(JSON.stringify(params)))

      if (this.data.type === 1 || this.data.type === 2) {
        app.setShopCartAdd(params, (shopCartList) => {
          this.setData({
            quantity: 1
          })
          wx.showToast({
            title: '成功加入购物车',
            icon: 'none', // loading
            duration: 1500,
            mask: true
          })
          this.isActive(false);
          this.triggerEvent("shopCartOnSuccess", {
            shopCartList,
            params
          });
        })
      }

      if (this.data.type === 3) {
        let postParams = {
          goodsId: params.goodsId,
          goodsCode: params.goodsCode,
          sourceSkuObj: this.data.sourceSkuObj,
          skuObj: params.skuObj,
          quantity: this.data.quantity,
          guigeList: params.guigeList
        }
        this.triggerEvent("guiGeSelectOnSuccess", postParams)
        this.isActive(false);
      }

      if (this.data.type === 4) {
        wx.setStorageSync('appyOrderGoods', [params]);
        this.isActive(false);
        wx.navigateTo({
          url: '/pages/shopping/applyOrder/index',
        })
      }
      try {
        let openid = getApp().globalData.ybfUserInfo && getApp().globalData.ybfUserInfo.openid || wx.getStorageSync('um_uuid')
        let curShopObj = app.getCurShopObj();
        let storeId = curShopObj.id // curShopObj.id
        reportingSku({
          actionType: 2,
          skus: [{
            sku: params.skuObj.sku,
            isB: params.skuObj.isB
          }],
          openid: openid,
          storeId: storeId,
          spu: this.data.detailsObj.goodsCode
        })
      } catch (e) {
      }
    },
    initializeData() {
      let skusList = this.data.detailsObj.skusList;
      console.log('detailsObj', this.data.detailsObj);
      this.setDisabledFalse(skusList);
      this.setIsSelectFlag(skusList);
      this.setData({
        ['detailsObj.skusList']: skusList
      })
    },
    // 方法
    isActive(flag = false, type = 1, currentSkuObj) {
      return new Promise((resolve, reject)=>{
        this.setData({
          show: flag,
          type: type,
          isFreeShippingAll: app.globalData.isFreeShippingAll
        }, () => {
          if (flag && (type == 1 || type == 2 || type == 4)) {
            this.initializeSelect().then(()=>{
              resolve();
            });
          }
          if (type == 3) {
            this.initializeData();
            if (currentSkuObj) {
              this.shopPageSeleceGuiGe(currentSkuObj);   
              resolve();
            }
          }
        })
      })
      

    },
    getCurrentSkuObj(skuId) {
      let curSkuObj = null;
      let skus = this.data.detailsObj.skus;
      skus.forEach((value,index)=>{
        if(skuId == value.sku) {
          curSkuObj = value;
        }
      })
      return curSkuObj;
    },
    initializeSelect(type=1,skuId=null) {
      // debugger;
      return new Promise((resolve, reject)=>{
        let skus = this.data.detailsObj.skus;
        let skusList = this.data.detailsObj.skusList;
        let returnFLag = false;
        // 有选中的就不用初始化
        skusList.forEach((value, index) => {
          value.value.forEach((childValue, childIndex) => {
            if (childValue.isSelect) {
              returnFLag = true;
            }
          })
        })
        if (returnFLag) {
          resolve();
          return;
        }


        let flag = false;
        let curSkuObj = null;
        for (let i = 0;i < skus.length;i++) {

            let value = skus[i];
            if(type==2) {
              let currentSkuObj = this.getCurrentSkuObj(skuId);
              if(currentSkuObj) {
                value = currentSkuObj;
              }else {
                break;
              }
            }
            let shopCartObj = this.getCurSkuShopCartListNumber(2, value);
            if (value.isB === 0) {
              if (shopCartObj && value.reserveStock > shopCartObj.skuShopNumber) {
                flag = true;
              }
            }

            if (isBPro(value)) {

              if (this.isBFlag(value)) {
                flag = true;
              }
            }
            if (flag) {
              curSkuObj = value;
              break;
            }
            if(type == 2) {
              if(!flag) {
                curSkuObj = value;
              }
              break;
            }
        }
        console.log('flag', flag);
        console.log('curSkuObj', curSkuObj);
        if (flag && curSkuObj) {
          console.log('选中了')
          this.setData({
            currentSkuObj: curSkuObj,
            maxQuantity: curSkuObj.reserveStock > 100 ? 100 : curSkuObj.reserveStock
          })
          this.setMoRen(curSkuObj);
          resolve(curSkuObj);
        } else {
          console.log('选中了2')
          // 所有的禁用
          this.setData({
            productStatus: 2
          }, () => {
            this.triggerEvent('setProductStatus', 2);
          })
          this.setDisabledFalse(skusList, 2);
          resolve(curSkuObj)
        }
      })
      
    },
    setMoRen(curSkuObj) {

      let skusList = this.data.detailsObj.skusList;
      let selectListObj = {};
      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          for (let key in curSkuObj.attrsJson) {
            if (childValue.value === curSkuObj.attrsJson[key]) {
              childValue.isSelect = true;
              if (childValue.isSelect) {
                selectListObj[index] = childValue;
              }
            }
          }

        })
      })
      this.setData({
        selectListObj: selectListObj
      })
      console.log('selectListObj', selectListObj);
      this.newSetDisabled(skusList);
      let selectButtonList = this.setselectButtonList(skusList, 1);
      this.setData({
        ['detailsObj.skusList']: skusList,
        selectButtonList: selectButtonList
      })

    },
    getCurGuiGelist(currentSkuObj) {
      let guigeList = [];
      let curSkuObj = this.data.detailsObj.skus.find((value,index)=>{
        return value.sku == currentSkuObj.skuObj.sku;
      })
      if(curSkuObj && curSkuObj.attrsJson) {
        for(let key in curSkuObj.attrsJson) {
          let params = {
            name: key,
            value: curSkuObj.attrsJson[key]

          }
          guigeList.push(params);
        }
      }
      return guigeList;
    },
    shopPageSeleceGuiGe(currentSkuObj) {
      console.log('currentSkuObj', currentSkuObj);
      // 新增加价格赋值
      currentSkuObj.skuObj.price = currentSkuObj.postSkuObj && currentSkuObj.postSkuObj.goodsCSkuConfig ? currentSkuObj.postSkuObj.goodsCSkuConfig.price : '0'
      this.setData({
        quantity: currentSkuObj.quantity,
        sourceSkuObj: currentSkuObj,
        maxQuantity: currentSkuObj.postSkuObj.stockSku.reserveStock > 100 ? 100 : currentSkuObj.postSkuObj.stockSku.reserveStock,
        currentSkuObj: currentSkuObj.skuObj
      }, () => {
        let skusList = this.data.detailsObj.skusList;
        let guigeList = currentSkuObj.guigeList;
        if(guigeList.length == 0) {
          guigeList = this.getCurGuiGelist(currentSkuObj);
        }
        skusList.forEach((value, index) => {
          value.value.forEach((childValue, childIndex) => {
            guigeList.forEach((gValue, gIndex) => {
              if (childValue.value == gValue.value) {
                childValue.isSelect = true;
              }
            })
          })
        })

        let selectButtonList = this.setselectButtonList(skusList);

        let currentSkuObjNew = this.getCurrentSkuObj(currentSkuObj.skuObj.sku)
        console.log('currentSkuObjNew', currentSkuObjNew);

        this.setData({
          ['detailsObj.skusList']: skusList,
          selectButtonList: selectButtonList,
          currentSkuObj: currentSkuObjNew
        }, () => {

        })
      })




    },
    onClose() {
      this.isActive(false);
    },
    setDisabledFalse(skusList, type = 1) {
      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          if (type == 1) {
            if (this.ifInventory(childValue)) {
              childValue.disabled = false;
            } else {
              childValue.disabled = true;
            }
          }
          if (type == 2) {
            childValue.disabled = true;
          }


        })
      })
      this.setData({
        ['detailsObj.skusList']: skusList
      })
    },
    setIsSelectFlag(skusList) {
      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          childValue.isSelect = false;
        })
      })
    },
    newSetSelect(index, itemindex) {
      let skusList = [...this.data.detailsObj.skusList];
      skusList[index].value.forEach((childValue, childIndex) => {
        if (childIndex === itemindex) {
          childValue.isSelect = !childValue.isSelect;
          let str = `selectListObj[${index}]`
          if (childValue.isSelect) {

            this.setData({
              [str]: childValue
            }, () => { })
          } else {
            this.setData({
              [str]: null
            })
          }
        } else {
          childValue.isSelect = false;
        }
      })
      return skusList;
    },
    isBFlag(skuObj) {
      let shopCartList = app.getShopCartList() || []; // 购物车列表
      let skuReserveStock = skuObj.reserveStock; // 当前可卖库存
      let skuShopNumber = this.getCurSkuShopCartListNumber_1(skuObj, shopCartList) || 0; // 购物车当前sku数量
      let shopSkuTotal = this.getCurSpuChildSkuNumber(skuObj, shopCartList) || 0; // 购物车数量
      let goodsMaxReserve = this.data.detailsObj.totalInventory; // 当前允许最大值
      let betweenTotal = goodsMaxReserve - shopSkuTotal; // 当前剩余允许最大值
      let canBuyTotal = skuReserveStock - skuShopNumber; // 可以库存差
      let total = Math.min(betweenTotal, canBuyTotal);
      // 旧的 skuShopNumber >= total 
      if (total <= 0) {
        return false;
      }

      return true;
    },
    // 判断是否可以找到规格，判断数量
    ifInventory(childValue) {
      let selectListObj = this.data.selectListObj;
      let shopCartList = app.getShopCartList() || [];
      let skuObj = this.getSkuId(childValue);
      if (!skuObj) {
        return true;
      }
      // 获取当前库存 和购物车数量
      let skuReserveStock = skuObj.reserveStock;
      if (skuReserveStock == 0) {
        return false;
      }
      let skuShopNumber = this.getCurSkuShopCartListNumber_1(skuObj, shopCartList) || 0;
      let shopSkuTotal = this.getCurSpuChildSkuNumber(skuObj, shopCartList) || 0;
      let goodsMaxReserve = this.data.detailsObj.totalInventory;
      if (isBPro(skuObj)) {
        let betweenTotal = goodsMaxReserve - shopSkuTotal; // 
        let canBuyTotal = skuReserveStock - skuShopNumber; // 
        let total = Math.min(betweenTotal, canBuyTotal);

        if (this.data.type == 1 || this.data.type == 2 || this.data.type == 4) {
          // 旧的 skuShopNumber >= total
          if (total <= 0) {
            return false;
          } else {
            return true;
          }
        }

      } else {
        if (this.data.type == 1 || this.data.type == 2 || this.data.type == 4) {
          if (skuShopNumber >= skuReserveStock) {
            return false;
          } else {
            return true;
          }
        }

      }
      return true;
    },
    intersectListInclude(intersectList, childValueValue, skusList) {
      // let skusList = this.data.detailsObj.skusList;
      let indexList = [];
      let selectList = [];
      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          if (childValue.isSelect && !indexList.includes(index)) {
            indexList.push(index);
          }
        })
      })

      if (indexList.length > 0) {
        skusList.forEach((value, index) => {
          indexList.forEach((listValue, listIndex) => {
            if (listValue == index) {
              value.value.forEach((childValue, childIndex) => {
                selectList.push(childValue.value)
              })
            }
          })

        })
      }
      let flag = intersectList.includes(childValueValue) || selectList.includes(childValueValue);
      return flag;
    },
    newSetDisabled(skusList, index, itemindex) {
      let selectListObj = this.data.selectListObj;
      let list = [];
      if (selectListObj && selectListObj.length > 0) {
        selectListObj.forEach((value, index) => {
          if (value) {
            list.push(value.existList)
          }
        })
      }
      let intersectList = intersect(JSON.parse(JSON.stringify(list)));
      if (!intersectList) {
        this.setDisabledFalse(skusList);
        return;
      }

      skusList.forEach((value, index) => {
        value.value.forEach((childValue, childIndex) => {
          // intersectList && intersectList.includes(childValue.value) && 
          console.log('intersectListInclude', intersectList)
          if (this.intersectListInclude(intersectList, childValue.value, skusList) && this.ifInventory(childValue)) {
            childValue.disabled = false;
          } else {
            childValue.disabled = true;
          }
        })

      })
    },
    setselectButtonList(skusList, type = 1) {
      // 1选中select，2是整个规格参数
      let list = [];
      if (type == 1) {
        skusList.forEach((value, index) => {
          value.value.forEach((childValue, childIndex) => {
            if (childValue.isSelect) {
              list.push(childValue);
            }
          })
        })
      }

      if (type == 2) {
      }

      return list;
    },
    newSelectGuigeButton(e) {
      let {
        index,
        itemindex
      } = e.currentTarget.dataset;
      this.newSelectGuigeButton_1(index, itemindex);
    },
    newSelectGuigeButton_1(index, itemindex) {
      let skusList = this.newSetSelect(index, itemindex);
      this.newSetDisabled(skusList, index, itemindex);

      // UI改版增加的 选中select
      let selectButtonList = this.setselectButtonList(skusList, 1);
      this.setData({
        ['detailsObj.skusList']: skusList,
        selectButtonList: selectButtonList
      }, () => {
        let currentSkuObj = this.getSkuId();
        if (currentSkuObj) {
          this.setData({
            currentSkuObj: currentSkuObj,
            maxQuantity: currentSkuObj.reserveStock >= 100 ? 100 : currentSkuObj.reserveStock
          },()=>{
            this.triggerFlagAndNumber();
            this.triggerFlagAndNumberGift();
          })
        } else {
          this.setData({
            currentSkuObj: null
          })
        }
        this.triggerEvent('onSkusListChang', skusList);
      })
    }
  },
  created() { }
})