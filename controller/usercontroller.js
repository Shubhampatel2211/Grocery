const User = require('../model/user')
const jwt = require('jsonwebtoken');
const validator = require('../middleware/validation')
const ResponseController = require('./responsecontroller');

class Usercontroller {

	async register(req, res) {
		try {
			await validator.registervalidation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var mobileno = decoded.user[0].mobileno;
			let data = await User.register(req.body, mobileno);
			return ResponseController.success(data, 'registered successsfully', res);
		} catch (error) {
			// res.send(error);
			return ResponseController.error(error, res);
		}
	}

	async login(req, res) {
		try {
			var user = await User.login(req.body);
			if (user) {
				user[0].authtoken = '';
				let token = jwt.sign({ user: user }, 'practice', { expiresIn: '30d' });
				db.query(`UPDATE users SET authtoken='${token}' where mobileno='${user[0].mobileno}';`)
				var [userdata] = await db.query(`select * from users where mobileno='${user[0].mobileno}'`)
				return ResponseController.success(userdata, 'user login successfully', res);
			}

		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async sendotp(req, res) {
		try {
			await validator.sendOtpValidation(req.body)
			var user = await User.sendotp(req.body);
			return ResponseController.success(user, 'otp send successfully', res);
		} catch (error) {
			console.log(error)
			return ResponseController.error(error, res);
		}
	}

	async categorydata(req, res) {
		try {
			var user = await User.categorydata();
			return ResponseController.success(user, 'subcategory fetched', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async productlist(req, res) {

		try {
			await validator.productidValidation(req.body)
			var user = await User.productlist(req.body);
			return ResponseController.success(user, 'product displayed', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}


	async resend(req, res) {
		try {
			var user = await User.resend(req.body);
			return ResponseController.success(user, 'otp resend successfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async search(req, res) {
		try {
			var user = await User.search(req.body);
			return ResponseController.success(user, 'search baar', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}


	async addwishlist(req, res) {

		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.addwishlist(req.body, id);
			return ResponseController.success(user, 'wishlist', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async getwishlist(req, res) {

		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.getwishlist(id);
			return ResponseController.success(user, 'get wishlist', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async brandlist(req, res) {

		try {
			var user = await User.brandlist();
			return ResponseController.success(user, 'brands displayed', res);
		} catch (error) {

			return ResponseController.error(error, res);
		}
	}

	async discount(req, res) {

		try {
			var user = await User.discount();
			return ResponseController.success(user, 'discount percentage', res);
		} catch (error) {

			return ResponseController.error(error, res);
		}
	}

	async sortby(req, res) {

		try {
			var user = await User.sortby();
			return ResponseController.success(user, 'sort by entites', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async pricerange(req, res) {
		try {
			var user = await User.pricerange();
			return ResponseController.success(user, 'price range', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async brandsearch(req, res) {
		try {
			var user = await User.brandsearch(req.body);
			return ResponseController.success(user, 'search brand', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async addtocart(req, res) {
		try {
			await validator.cartValidation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.addtocart(req.body, id);
			return ResponseController.success(user, 'product added to cart successfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async deletefromcart(req, res) {
		try {
			// await validator.cartValidation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.deletefromcart(req.body, id);
			return ResponseController.success(user, 'product deleted from cart', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async cartlist(req, res) {
		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.cartlist(id, req.body);
			return ResponseController.success(user, 'cart-list displayed', res);
		} catch (error) {
			console.log(error)
			return ResponseController.error(error, res);
		}
	}

	async addaddress(req, res) {

		try {
			await validator.addressvalidation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.addaddress(req.body, id);
			return ResponseController.success(user, 'address added successfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async deleteaddress(req, res) {

		try {
			await validator.addressidvalidation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.deleteaddress(req.body, id);
			return ResponseController.success(user, 'delete address successfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async getaddresslist(req, res) {

		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.getaddresslist(id);
			return ResponseController.success(user, 'address-list fetched', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}

	}

	async homemanagement(req, res) {
		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.homemanagement(id);
			return ResponseController.success(user, 'home management', res);
		} catch (error) {
			console.log(error)
			return ResponseController.error(error, res);
		}

	}

	async checkout(req, res) {
		try {
			await validator.checkout(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.checkout(id, req.body);
			return ResponseController.success(user, 'checkout', res);
		} catch (error) {
			console.log(error)
			return ResponseController.error(error, res);
		}

	}


	async orderlist(req, res) {

		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.orderlist(id);
			return ResponseController.success(user, 'order-list fetched', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}

	}

	async orderdetails(req, res) {
		try {
			await validator.orderdetails(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.orderdetails(id, req.body);
			return ResponseController.success(user, 'order-details fetched', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}

	}

	async create_customer(req, res) {
		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.create_customer(id);
			return ResponseController.success(user, 'customer created succesfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async add_card(req, res) {
		try {
			await validator.add_card_validation(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.add_card(req.body, id);
			return ResponseController.success(user, 'card added succesfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}


	async charge_customer(req, res) {
		try {
			//await validator.orderdetails(req.body)
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.charge_customer(req.body, id);
			return ResponseController.success(user, 'customer charged succesfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async add_review(req, res) {
		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token, 'practice')
			var id = decoded.user[0].id;
			var user = await User.add_review(req.body, id);
			return ResponseController.success(user, 'review added  succesfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async review_list(req, res) {
		try {
			// let token = req.headers.authorization;
			// var decoded = jwt.verify(token, 'practice')
			// var id = decoded.user[0].id;
			var user = await User.review_list(req.body);
			return ResponseController.success(user,'review added succesfully', res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async customer_service(req, res) {
		try {
			var user = await User.customer_service();
			return ResponseController.success(user,'customer service fetched  succesfully',res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}

	async notifications(req, res) {
		try {
			let token = req.headers.authorization;
			var decoded = jwt.verify(token,'practice')
			var id = decoded.user[0].id;
			var user = await User.notifications(id);
			return ResponseController.success(user,'notification sent succesfully',res);
		} catch (error) {
			return ResponseController.error(error, res);
		}
	}
}


module.exports = new Usercontroller()