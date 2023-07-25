const express = require('express');
const User=require('../model/user')
const UserController = require('../controller/usercontroller');
const authMiddleware = require('../middleware/auth');

const router= express.Router()

/* registration and profile update api */
router.post('/register',authMiddleware.authenticate,UserController.register)

/* login api */
router.post('/login',authMiddleware.authenticatelogin,UserController.login)

/* resend otp api*/
router.post('/resend',authMiddleware.authenticateotp,UserController.resend)

/* sendotp api*/
router.post('/sendotp',authMiddleware.authenticateotp,UserController.sendotp)

/* category list api*/
router.post('/categorydata',authMiddleware.authenticate,UserController.categorydata)

/* product list api*/
router.post('/product-list',authMiddleware.authenticate,UserController.productlist)

/* search and filter  api*/
router.post('/search',authMiddleware.authenticate,UserController.search)

/* add and delete wishlist  api*/
router.post('/addwishlist',authMiddleware.authenticate,UserController.addwishlist)

/* get wishlist api*/
router.post('/getwishlist',authMiddleware.authenticate,UserController.getwishlist)

/* brand list  api*/
router.post('/brandlist',authMiddleware.authenticate,UserController.brandlist)

/* discount api */
router.post('/discount',authMiddleware.authenticate,UserController.discount)

/* sortby api*/
router.post('/sortby',authMiddleware.authenticate,UserController.sortby)

/* price range api*/
router.post('/pricerange',authMiddleware.authenticate,UserController.pricerange)

/* brand search api*/
router.post('/brandsearch',authMiddleware.authenticate,UserController.brandsearch)

/* add product to cart api*/
router.post('/addtocart',authMiddleware.authenticate,UserController.addtocart)

/* delete product from cart api*/
router.post('/deletefromcart',authMiddleware.authenticate,UserController.deletefromcart)

/* cart list api */
router.post('/cartlist',authMiddleware.authenticate,UserController.cartlist)

/* add address api */
router.post('/addaddress',authMiddleware.authenticate,UserController.addaddress)

/* delete address api */
router.post('/deleteaddress',authMiddleware.authenticate,UserController.deleteaddress)

/* address-list api */
router.post('/addresslist',authMiddleware.authenticate,UserController.getaddresslist)

/* home management api */
router.post('/homemanagement',authMiddleware.authenticate,UserController.homemanagement)

/* checkout api */
router.post('/checkout',authMiddleware.authenticate,UserController.checkout)

/* orderlist api */
router.post('/orderlist',authMiddleware.authenticate,UserController.orderlist)

/* orderdetails api */
router.post('/orderdetails',authMiddleware.authenticate,UserController.orderdetails)

/* create customer api */
router.post('/createcustomer',authMiddleware.authenticate,UserController.create_customer)

/* card add api */
router.post('/add_card',authMiddleware.authenticate,UserController.add_card)

/* customer charge  api */
router.post('/charge_customer',authMiddleware.authenticate,UserController.charge_customer)

/* add review api */
router.post('/add_review',authMiddleware.authenticate,UserController.add_review)

/* review list api */
router.post('/review_list',authMiddleware.authenticate,UserController.review_list)

/* customer_service  api */
router.post('/customer_service',authMiddleware.authenticate,UserController.customer_service)

/* notification api */
router.post('/notifications',authMiddleware.authenticate,UserController.notifications)

module.exports=router;
