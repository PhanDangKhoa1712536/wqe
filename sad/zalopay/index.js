//const fs = require('fs');
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');
const uuid = require('uuid/v1'); // npm install uuid
const bodyParser = require('body-parser');
//const Crypto = require('./Crypto');

class ZaloPay {
    constructor() {
      const self = this;
    }
    config = {
      appid: "553",
      key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
      key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
      endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
    };
    
    embeddata = {
      zptoken: "",
      redirecturl: "http://localhost:3000/success",
      merchantinfo: "embeddata123",
      CallbackURL: "http://localhost:3000/"
    };
    
    items = [{
      itemid: "knb",
      itemname: "kim nguyen bao",
      itemprice: 198400,
      itemquantity: 1
    }];
    order = {
      appid: "553", 
      apptransid: `${moment().format('YYMMDD')}_${uuid()}`, // mã giao dich có định dạng yyMMdd_xxxx
      appuser: "demo", 
      apptime: Date.now(), // miliseconds
      item: JSON.stringify(this.items), 
      embeddata: JSON.stringify(this.embeddata), 
      amount: 50000, 
      description: "ZaloPay Integration Demo",
      bankcode: "", 
  };
    async CreateOrder() {
        //const order = this.NewOrder(params);
        const data = this.config.appid + "|" + this.order.apptransid + "|" + this.order.appuser + "|" + this.order.amount + "|" + this.order.apptime + "|" + this.order.embeddata + "|" + this.order.item;
        this.order.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

        const { data: result } = await axios.post(this.config.endpoint, null, {
        params: this.order
        });

        result.apptransid = this.order.apptransid;
        console.log(result);
        return result;
    }

    async GetStatusByTransID(){
      const endpoint= "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid";

      let params = {
        appid: this.config.appid,
        apptransid: "190308_123456", 
      };

      let data = this.config.appid + "|" + params.apptransid + "|" + this.config.key1; // appid|apptransid|key1
      params.mac = CryptoJS.HmacSHA256(data, this.config.key1).toString();

      const { data: result } = await axios.post(endpoint, null, {
        params
      });
  
      return result;
    }

   async VerifyCallback(data, requestMac) {
     const result = {};
     const mac = CryptoJS.HmacSHA256(data, this.config.key2).toString();
 
     if (mac !== requestMac) {
       result.returncode = -1;
       result.returnmessage = "mac not equal";
    } else {
       result.returncode = 1;
       result.returnmessage = "success";
     }
 
     return result;
   }
    // VerifyCallback_ver2(){
    //   app.use(bodyParser.json());

    //   app.post('/success', (req, res) => {
    //     let result = {};

    //     try {
    //       let dataStr = req.body.data;
    //       let reqMac = req.body.mac;

    //       let mac = CryptoJS.HmacSHA256(dataStr, this.config.key2).toString();
    //       console.log("mac =", mac);


          
    //       if (reqMac !== mac) { //kiểm tra callback hợp lệ (đến từ ZaloPay server)
    //         //callback không hợp lệ
    //         result.returncode = -1;
    //         result.returnmessage = "mac not equal";
    //       }
    //       else {
    //         //thanh toán thành công
    //        // merchant cập nhật trạng thái cho đơn hàng
    //         let dataJson = JSON.parse(dataStr, config.key2);
    //         console.log("update order's status = success where apptransid =", dataJson["apptransid"]);

    //         result.returncode = 1;
    //         result.returnmessage = "success";
    //       }
    //     } catch (ex) {
    //       result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    //       result.returnmessage = ex.message;
    //     }

    //     //thông báo kết quả cho ZaloPay server
    //     res.json(result);
    //   });
    // }
}
module.exports = new ZaloPay();