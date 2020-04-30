var express = require('express');
var router = express.Router();
var ZaloPay = require("../zalopay");



/* GET home page. */
router.get('/', async(req, res) =>{
  var result = await ZaloPay.CreateOrder();
  console.log(result);
  res.render('index',{title: 'Express',link: result.orderurl});
});


router.get('/success',function(req,res,next){
  res.render('index',{title: 'success',link: 'https://gamek.vn/'});
});



module.exports = router;
