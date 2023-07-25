const promise = require('bluebird')
var stripe = require('stripe')
	('sk_test_51NDMfEH8APDdvK1GHg5UWdPJWzkr484qpOL05ezs7j4TLEyBJx8Pph0DkUlSv5q82cHL9yeSJ7t7fCLB5QNr47wG00MvQM9fnt')
var Notification = require('../model/notification')
const moment = require('moment')
const notification = require('../model/notification')
class User {

	/*user register */

	async register(body, mobileno) {

		return new Promise(async (resolve, reject) => {

			try {
				let { firstname, lastname, email } = body

				var [emailcheck] = await db.query(`SELECT * FROM users where email='${email}'`);

				for (let i = 0; i < emailcheck.length; i++) {

					if (emailcheck[i].email == email && emailcheck[i].mobileno == mobileno) {
						// console.log("==================")
						var [update] = await db.query(`UPDATE users set firstname = '${firstname}', lastname= '${lastname}',email ='${email}',isregistered="1" where mobileno='${mobileno}'`);
						if (update) {
							resolve(body);
							// resolve("profile is updated");
							var [uquery] = await db.query(`SELECT * FROM users where mobileno='${mobileno}' and isregistered="1"`);
						}
					}

					else {
						//console.log("+++++++++++++++==")
						//var error = { message:"email already exits" }
						var error = Error("email already exits");
						reject(error);
					}
				}

				if (!emailcheck.length > 0) {
					var [update] = await db.query(`UPDATE users set firstname = '${firstname}', lastname= '${lastname}',email ='${email}',isregistered="1" where mobileno='${mobileno}'`);
					if (update) {
						// resolve("profile is updated");
						resolve(body);
						var [uquery] = await db.query(`SELECT * FROM users where mobileno='${mobileno}' and isregistered="1"`);
					} else {
						var error = Error("not updated your data");
						reject(error);
					}
				}
				// var [check] = await db.query(`SELECT * FROM users where mobileno='${mobileno}' and isregistered="1"`)
				// if (check.length > 0) {
				//     var [update] = await db.query(`UPDATE users SET firstname='${firstname}',lastname='${lastname}',email='${email}' where mobileno='${mobileno}';`)
				//     if (update) {
				//         return resolve(body);
				//     } else {
				//         return reject(err)
				//     }
				// }

			} catch (error) {
				var err = { message: error.message }
				return reject(err)
			}
		})
	}

	/*user login */
	async login(body) {
		try {
			return new Promise(async (resolve, reject) => {

				let { mobileno, otp } = body
				var [mobilecheck] = await db.query(`SELECT * FROM users WHERE mobileno ='${mobileno}'`)
				if (mobilecheck.length > 0) {
					var [otpcheck] = await db.query(`SELECT * FROM users WHERE mobileno ='${mobileno}' and otp='${otp}' `)
					if (!otpcheck.length > 0) {
						var data = {
							status: 200,
							message: 'otp is not valid',
							detail: {}
						}
						reject(data)
					}
					else {
						return resolve(otpcheck)
					}
				}
				else {
					var err = { message: "mobile number does not exists" }
					return reject(err)
				}
			})
		}
		catch (error) {
			return reject(error)
		}
	}


	/* send otp */

	async sendotp(body) {

		return new Promise(async (resolve, reject) => {

			try {
				let { mobileno } = body
				var [check] = await db.query(`SELECT * FROM users where mobileno='${mobileno}' and isregistered='1'`)

				if (check.length > 0) {

					var val = Math.floor(1000 + Math.random() * 9000);
					db.query(`UPDATE users set otp = '${val}' WHERE mobileno ='${mobileno}';`)
					var message = { otp: val }
					return resolve(message)

				} else {
					var [insert] = await db.query(`INSERT INTO users (mobileno) values ('${mobileno}')`)
					if (insert) {
						var val = Math.floor(1000 + Math.random() * 9000);
						db.query(`UPDATE users set isregistered='1',otp ='${val}' WHERE mobileno ='${mobileno}';`)
						var message = { otp: val }
						return resolve(message)
					}
					return reject(err)
				}
			} catch (error) {
				return reject(error)
			}

		})
	}

	/* resend otp */

	async resend(body) {

		return new Promise(async (resolve, reject) => {

			try {
				let { mobileno } = body
				var [check] = await db.query(`SELECT * FROM users where mobileno='${mobileno}' and isregistered='1'`)

				if (check.length > 0) {

					var val = Math.floor(1000 + Math.random() * 9000);
					console.log("------>>>", val);
					db.query(`UPDATE users set otp = '${val}' WHERE mobileno ='${mobileno}';`)
					var message = { otp: val }
					return resolve(message)

				}
				else {
					console.log("===-----")
					var err = { message: "mobile number does not exists" }
					return reject(err)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}


	/* category wise subcategory data fetched */

	async categorydata() {
		try {
			return new Promise(async (resolve, reject) => {

				let [category, field] = await db.query(`SELECT * FROM category where status='1'`);
				for (let i = 0; i < category.length; i++) {
					const [subCategories, fields] = await db.query(`select * from subcategory where category_id='${category[i].category_id}' and status='1'`);
					category[i].subcategory = subCategories;
				}
				resolve(category);
			});
		} catch (error) {
			return reject(error)
		}

	}

	/* product item fetched */

	async productlist(body) {

		return new Promise(async (resolve, reject) => {
			try {
				let { id } = body
				let [subcategory, field] = await db.query(`select * from subcategory where subcategory_id=${id}`);
				if (subcategory.length > 0) {
					const [products, fields] = await db.query(`select * from products where subcategory_id='${subcategory[0].subcategory_id}'`);
					console.log(products)
					if (products.length > 0) {

						for (let j = 0; j < products.length; j++) {
							let brandresult = products.map(({ brand_id }) => brand_id)
							const [brandname] = await db.query(`select name from brand where brand_id='${brandresult[j]}'`)
							products[j].brandname = brandname[0].name
							let result = products.map(({ price }) => price)
							let result2 = products.map(({ discount }) => discount)

							var result3 = result[j] - (result[j] * (result2[j] / 100))

							products[j].finalprice = result3
						}
						subcategory[0].productlist = products;

						var list = subcategory[0].productlist
						//var results = subcategory.map(({ productlist }) => productlist)



						var [datas] = await db.query(`select * from brand where subcategoryid='${id}'`)
						console.log(datas)
						return resolve({ productlist: list, brandlist: datas });
					} else {
						var err = { message: "id not found please enter valid id" }
						reject(err)
						// subcategory[0].productlist = []

					}
				}
				else {
					var err = { message: "id not found please enter valid id" }
					reject(err)
				}
			} catch (error) {

				return reject(error)
			}
		})

	}

	/* search and filter product */

	async search(body) {

		let { search, filter } = body
		return new Promise(async (resolve, reject) => {
			try {
				if ('search' in body) {
					search = `${search}`.trim();
					var [products, field] = await db.query(
						`SELECT productname,image,price,variation FROM products where productname like '%${search}%'`
					);
					resolve(products);
				}

				if ('filter' in body) {

					let filterCondition = await this.filterBy(filter);
					resolve(filterCondition);
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	async filterBy(filter) {

		var query = `select products.productname,products.image,products.price,products.variation from products join brand on products.brand_id=brand.brand_id `;

		if (filter.brand) {
			let brandIds = filter.brand.toString();
			if (brandIds.length > 0) {
				query = query + `where products.brand_id in (${brandIds})`;
			}
			query = query;
		}

		if (filter.price) {
			let maxPrice = filter.price.max;
			let minPrice = filter.price.min;
			query =
				query + `AND products.price BETWEEN ${minPrice} AND ${maxPrice} `;
		}

		if (filter.discount) {
			let minDiscount, maxDiscount;
			switch (filter.discount) {
				case 1:
					minDiscount = 0;
					maxDiscount = 5;
					break;

				case 2:
					minDiscount = 5;
					maxDiscount = 10;

					break;
				case 3:
					minDiscount = 15;
					maxDiscount = 20;

					break;
			}
			query = query + `AND products.discount BETWEEN ${minDiscount} AND ${maxDiscount}`;
		}

		if (filter.sortby) {
			switch (filter.sortby) {
				case 1:
					query = query + ` ORDER by products.price ASC`;
					break;

				case 2:
					query = query + ` ORDER by products.price DESC`;
					break;
			}
		}
		var [result] = await db.query(query);
		console.log(query);
		return result;
	}

	async addwishlist(body, id) {
		try {
			return new Promise(async (resolve, reject) => {

				var { productid } = body

				var [product] = await db.query(`select * from products where product_id='${productid}'`);

				if (product.length > 0) {

					var [check] = await db.query(`select * from wishlist where user_id='${id}' and product_id='${productid}'`);


					if (check.length > 0) {

						var [del] = await db.query(`delete from wishlist where user_id='${id}' and product_id='${productid}'`);
						console.log('--------')
						var alldel = { message: "product removed from wishlist" }

						resolve(alldel)

						if (del) {

							var [flag1] = await db.query(`update products set flag='0' where product_id='${productid}'`);
							console.log("----->>flagdelete", flag1)
						}
					} else {
						var [insert] = await db.query(`INSERT INTO wishlist (user_id,product_id) values ('${id}','${productid}')`)

						var allinsert = { message: "product added to wishlist successfully" }
						resolve(allinsert)
						if (insert) {

							var [flag] = await db.query(`update products set flag='1' where product_id='${productid}'`);
							console.log("----->>flaginsert", flag)

						}
					}

				}
				else {
					var err = { message: "product id not found please enter valid product id" }
					reject(err)
				}
			})
		} catch (error) {
			return reject(error);
		}
	}

	/* all wishlist */

	async getwishlist(id) {
		return new Promise(async (resolve, reject) => {

			try {
				var [fetch] = await db.query(`select * from products inner join wishlist on products.product_id=wishlist.product_id where wishlist.user_id='${id}'`);
				if (fetch) {
					resolve(fetch)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/* brand list */

	async brandlist() {
		return new Promise(async (resolve, reject) => {
			try {
				var [fetch] = await db.query(`select * from brand where status='1'`);
				if (fetch) {
					resolve(fetch)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/*discount percentage */

	async discount() {
		return new Promise(async (resolve, reject) => {
			try {
				var discount = {

					1: "Upto 5%",
					2: "5%-10%",
					3: "10%-15%",
					4: "15%-25%",
					5: "More then 25%"

				}
				resolve(discount)
			} catch (error) {
				return reject(error)
			}

		})
	}

	/* sort by */

	async sortby() {
		return new Promise(async (resolve, reject) => {
			try {
				var sortby = {
					1: "Popularity",
					2: "Price-Low to High",
					3: "Price- High to Low",
					4: "Alphabetical",
					5: "Rupee-Saving High to Low",
					6: "Rupee-Saving Low to High",
					7: "%Off-High to Low"
				}

				resolve(sortby)
			} catch (error) {
				return reject(error)
			}

		})
	}

	/*price range from minimum to maximum */

	async pricerange() {
		return new Promise(async (resolve, reject) => {
			try {
				var [maxmin] = await db.query(`select min(price) as minprice,max(price) as maxprice from products`);
				resolve(maxmin)
				console.log(maxmin)
			} catch (error) {
				return reject(error)
			}
		})
	}

	/*brand search */

	async brandsearch(body) {

		return new Promise(async (resolve, reject) => {

			try {

				let { search } = body
				var a = [];
				let [brand, field] = await db.query(`select * from brand`);
				var getdata = `${search}`.trim()

				for (let i = 0; i < brand.length; i++) {
					if (brand[i].name.match(getdata)) {
						a.push(brand[i])
					}
				}
				resolve(a);
			} catch (error) {
				return reject(error)
			}
		})
	}

	/* add  product to cart api*/

	async addtocart(body, id) {
		return new Promise(async (resolve, reject) => {
			try {

				let { productid, quantity } = body

				var [product] = await db.query(`select * from products where product_id='${productid}'`);

				if (product.length > 0) {
					var [check] = await db.query(`select * from addtocart where user_id='${id}' and product_id='${productid}'`);
					if (check.length > 0) {
						if (product[0].stock == '1') {
							await db.query(`update addtocart set quantity=${quantity} where user_id='${id}'and product_id='${productid}'`)
							var alldel = { message: "product quantity added in cart" }
							reject(alldel)
						} else {
							var outofstock = { message: "sorry currently product out of stock " }
							reject(outofstock)
						}
					}
					else {
						if (product[0].stock == '1') {
							await db.query(`INSERT INTO addtocart (user_id,product_id,quantity) values ('${id}','${productid}','${quantity}')`)
							resolve(body)

						} else {
							var outofstock = { message: "sorry currently product out of stock" }
							reject(outofstock)
						}

					}

				}
				else {
					var err = { message: "product id not found please enter valid product id" }
					reject(err)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/*delete product from cart */

	async deletefromcart(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { productid } = body
				var [product] = await db.query(`select * from products where product_id='${productid}'`);

				if (product.length > 0) {

					var [check] = await db.query(`select * from addtocart where user_id='${id}' and product_id='${productid}'`);
					if (!check.length > 0) {
						var alldel = { message: "product not found in cart" }
						reject(alldel)
					} else {
						await db.query(`delete from addtocart where user_id='${id}' and product_id='${productid}'`);
						resolve({})
					}
				} else {
					var err = { message: "product id not found please enter valid product id" }
					reject(err)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/*cart list display */

	async cartlist(id, body) {
		return new Promise(async (resolve, reject) => {
			try {

				let { quantity, product_id } = body

				var coupen_id = `${body.coupen_id}`;
				// module.exports= coupen_id

				var [deletestock] = await db.query(`Delete addtocart from addtocart  LEFT JOIN products ON addtocart.product_id=products.product_id where products.stock = '0' `)

				if ('quantity' && 'product_id' in body) {

					var [updatequantity] = await db.query(`update addtocart set quantity= '${quantity}' where user_id='${id}' and product_id='${product_id}'`)

				}
				var [deleteproduct] = await db.query(`delete from addtocart where quantity="0" `)


				var [fetch] = await db.query(`select products.product_id,products.image,products.productname,products.price,addtocart.quantity from products inner join addtocart on products.product_id=addtocart.product_id where addtocart.user_id='${id}' and products.stock='1'`);

				let finalcart = await this.finalcart(id, body)


				resolve(fetch.concat(finalcart))

				//console.log(coupen_id)

			} catch (error) {
				return reject(error)
			}
		})
	}


	async finalcart(id, body) {

		let { coupen_id } = body

		var final = [];
		var sum = 0

		/*mainprice object*/
		let [total] = await db.query(`select sum(price * quantity) as price from products inner join addtocart on products.product_id=addtocart.product_id where addtocart.user_id='${id}';`)
		var total2 = total[0].price



		/*total object*/
		let [data2] = await db.query(`select products.price as price ,products.discount as discount,products.discount_price as discount_price,addtocart.quantity as quantity from products inner join addtocart on products.product_id=addtocart.product_id where addtocart.user_id='${id}'and products.stock='1'`)
		console.log("----------", data2)

		for (let i = 0; i < data2.length; i++) {

			data2[i].price = data2[i].price * data2[i].quantity
			data2[i].discount = data2[i].discount * data2[i].quantity
			data2[i].discount_price = data2[i].discount_price * data2[i].quantity


			var discount = data2[i].price * data2[i].discount / 100

			if (discount < data2[i].discount_price) {
				var text = data2[i].price - discount

			} else {

				var text = data2[i].price - data2[i].discount_price

			}
			final.push(text)

		}

		for (let j = 0; j < final.length; j++) {
			sum = sum + final[j]
		}

		/*tax calculation for the total price */
		let [tax] = await db.query(`select tax from setting`)
		var tax2 = tax[0].tax
		var tax3 = sum * tax2 / 100

		/* delivery charge object */
		let [charge] = await db.query(`select freedeliveryupto as r from setting;`)
		var delivery = charge[0].r

		if (sum > delivery) {
			var result = "free"
		} else {
			var [data3] = await db.query(`select deliverycharge as p from setting;`)
			var result2 = data3[0].p
		}

		/* grand total object */

		if (result) {

			var data = sum + tax3

		} else {

			var grandtotal2 = sum + tax3 + result2

		}
		/* total saving object*/
		var saving = total2 - sum
		/* coupen management */

		const [coupen] = await db.query(`select * from coupen where coupen_id='${coupen_id}'`)

		if (coupen.length > 0) {

			const d = new Date()
			var currentdate = moment(coupen[0].startdate)
			var lastdate = moment(coupen[0].enddate)
			if (currentdate.isSameOrBefore(lastdate)) {
				if (sum > coupen[0].minpurchase) {
					data = data - coupen[0].discountprice
					grandtotal2 = grandtotal2 - coupen[0].discountprice
					saving = saving + coupen[0].discountprice
				}
				else {
					return (`total is not greter than '${coupen[0].minpurchase}' than coupen is not used`)
				}
			}
			else {
				return ("coupen is expired")
			}

		}

		let cart = {
			mainprice: total2,
			total: sum,
			tax: tax3,
			deliverycharge: result || result2,
			grandtotal: data || grandtotal2,
			totalsaving: saving
		}
		return cart;
	}

	/* add address */

	async addaddress(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { type, housedetail, landmark, reciepant_name } = body
				var [fetch] = await db.query(`select * from address where user_id='${id}' and type='${type}'`);

				if (!fetch.length > 0) {
					var [add] = await db.query(`INSERT INTO address (user_id,type,housedetail,landmark,reciepant_name)VALUES('${id}','${type}','${housedetail}','${landmark}','${reciepant_name}')`)
					return resolve(body)
				} else {

					var err = { message: "your address already been stored" }
					return reject(err)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/* delete address */
	async deleteaddress(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { address_id } = body
				var [fetch] = await db.query(`select * from address where user_id='${id}' and address_id='${address_id}'`);
				if (fetch.length > 0) {
					var [delete0] = await db.query(`DELETE FROM address WHERE  address_id='${address_id}'`)
					return resolve({})
				} else {
					var err = { message: "address id not found please enter valid address id" }
					return reject(err)
				}
			} catch (error) {
				return reject(error)
			}
		})
	}

	/*address list display */

	async getaddresslist(id) {
		return new Promise(async (resolve, reject) => {
			try {
				var [fetch] = await db.query(`select * from address where user_id='${id}'`);
				return resolve(fetch)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async homemanagement() {
		return new Promise(async (resolve, reject) => {
			try {

				var [section] = await db.query(`select * from section`)
				// console.log(section)

				for (let i = 0; i < section.length; i++) {

					const [imageslider] = await db.query(`select sectionslider.image,sectionslider.category_id,sectionslider.section_id,sectionslider.id from sectionslider  join category on sectionslider.category_id=category.category_id where sectionslider.section_id='${section[i].section_id}'`);

					if (imageslider.length > 0) {
						// section[i].category = [];
						section[i].image = imageslider;

					} else {
						section[i].image = []
						// section[i].category = [];
					}

					const [category] = await db.query(`select * from sectioncategory  join category on sectioncategory.category_id=category.category_id where sectioncategory.section_id='${section[i].section_id}'`)

					// console.log(category)
					if (category.length > 0) {
						section[i].category = category;
					} else {
						section[i].category = []
					}

					const [products] = await db.query(`select * from sectionproduct  join products on sectionproduct.product_id=products.product_id where sectionproduct.section_id='${section[i].section_id}'`)
					for (let j = 0; j < products.length; j++) {
						let brandresult = products.map(({ brand_id }) => brand_id)
						const [brandname] = await db.query(`select name from brand where brand_id='${brandresult[j]}'`)
						products[j].brandname = brandname[0].name
						let result = products.map(({ price }) => price)
						let result2 = products.map(({ discount }) => discount)

						var result3 = result[j] - (result[j] * (result2[j] / 100))

						products[j].finalprice = result3
					}
					if (result3) {
						section[i].product = products;

					} else {
						section[i].product = []
					}

					const [brand] = await db.query(`select * from sectionbrand  join brand on sectionbrand.brand_id=brand.brand_id where sectionbrand.section_id='${section[i].section_id}'`)

					if (brand.length > 0) {
						section[i].brand = brand
					} else {
						section[i].brand = []
					}
				}
				resolve(section)

			} catch (error) {
				return reject(error)
			}
		})
	}

	async checkout(id, body) {
		return new Promise(async (resolve, reject) => {
			try {
				let { address_id, coupen_id } = body
				var [address] = await db.query(`select address_id from address where user_id='${id}' and address_id='${address_id}'`)

				var cod = "CASH ON DELIEVERY"
				var data = await this.finalcart(id, body)

				const d = new Date()
				var currentdate = moment(d)

				var check = await db.query(`select * from addtocart where user_id='${id}'`)

				if (check.length > 0) {
					var [data2] = await db.query(`insert into orders(order_date,user_id,subtotal,delivery_charge,grandtotal,paymenttype,address_id,status,coupen_id) values ('${currentdate}','${id}','${data.total}','${data.deliverycharge}','${data.grandtotal}','${cod}','${address[0].address_id}','${1}','${coupen_id}')`)
					if (data2) {
						var [index] = await db.query(`select * from products inner join addtocart on products.product_id=addtocart.product_id  join orders on addtocart.user_id=orders.user_id where orders.user_id='${id}' and addtocart.user_id='${id}'`)
						console.log("-----++++++", index)
						for (let i = 0; i < index.length; i++) {
							var orderitem = await db.query(`insert into orderitem(product_id,order_id,price,discount_price,quantity)values('${index[i].product_id}','${index[i].order_id}','${index[i].price}','${index[i].discount_price}','${index[i].quantity}')`)
						}
					}
				}
				var cartlist = {
					item_total: data,
					delieverytype: cod
				}
				resolve(cartlist)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async orderlist(id) {
		return new Promise(async (resolve, reject) => {
			try {
				var [data] = await db.query(`select orders.order_date ,orders.order_id,orders.status,orders.grandtotal as Totalpayment,address.type as Deliveredto from orders inner join address on address.address_id=orders.address_id where orders.user_id='${id}'`)
				resolve(data)

			} catch (error) {
				return reject(error)
			}
		})
	}

	async orderdetails(id, body) {
		return new Promise(async (resolve, reject) => {
			try {
				var { order_id } = body

				var [data] = await db.query(`select orders.order_id as order_id,orders.paymenttype as paymenttype ,orders.order_date as order_date,address.housedetail as housedetail , address.landmark as landmark from orders inner join address on orders.address_id=address.address_id where orders.user_id='${id}' and orders.order_id='${order_id}'`)

				var data = [{
					order_id: data[0].order_id,
					paymenttype: data[0].paymenttype,
					deliver_to: data[0].housedetail + " " + data[0].landmark,
					order_date: data[0].order_date,
				}]

				var [items] = await db.query(`select products.image,products.productname,products.price,orderitem.quantity from orderitem inner join products on orderitem.product_id=products.product_id where  orderitem.order_id='${order_id}'`)
				data[0].item = items

				var [bill] = await db.query(`select subtotal,delivery_charge,grandtotal from orders where order_id='${order_id}'`)

				data[0].bill_details = bill[0]
				resolve(data)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async create_customer(id) {
		return new Promise(async (resolve, reject) => {
			try {
				var [database] = await db.query(`select * from users where id='${id}'`)
				var data = {
					name: database[0].firstname + " " + database[0].lastname,
					email: database[0].email,
				}
				var store = await stripe.customers.create(data)
				var datas = await db.query(`insert into customers_list(customer_stripe_id,name,email)values('${store.id}','${store.name}','${database[0].email}')`)
				return resolve(datas)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async add_card(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { number, exp_month, exp_year, cvv, name, cus_id } = body
				var data = {}
				data.card = {
					number: number,
					exp_month: exp_month,
					exp_year: exp_year,
					cvc: cvv,
					name: name
				}
				var store = await stripe.tokens.create(data)
				var [datas] = await db.query(`insert into card_table(token_id,user_id,card_number,exp_month,exp_year,cvv,name)values('${store.id}','${id}','${number}','${exp_month}','${exp_year}','${cvv}','${name}')`)
				var index = await stripe.customers.createSource(cus_id, { source: store.id })
				return resolve(index)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async charge_customer(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { amount, customer_id, currency, description } = body
				var data = {
					amount: amount,
					currency: currency,
					description: description,
					customer: customer_id
				}
				var charge = await stripe.charges.create(data)
				let date = new Date().toISOString().slice(0, 10)
				var [datas] = await db.query(`insert into charge_table(stripe_id,user_id,amount,date,currency,description,customer_id)values('${charge.id}','${id}','${amount}','${date}','${currency}','${description}','${customer_id}')`)
				return resolve(charge)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async add_review(body, id) {
		return new Promise(async (resolve, reject) => {
			try {
				let { product_id, rating, comments } = body
				let date = new Date().toISOString().slice(0, 10)
				console.log("========", date)
				var [data] = await db.query(`select * from users where id='${id}'`)
				var [database] = await db.query(`insert into review(user_id,product_id,rating,date,comments,name) values('${id}','${product_id}','${rating}','${date}','${comments}','${data[0].firstname + " " + data[0].lastname}')`)
				return resolve(body)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async review_list(body) {
		return new Promise(async (resolve, reject) => {
			try {
				let { product_id } = body
				var [data] = await db.query(`select * from review where product_id='${product_id}'`)
				return resolve(data)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async customer_service() {
		return new Promise(async (resolve, reject) => {
			try {
				var [data] = await db.query(`select * from customer_service`)
				return resolve(data)
			} catch (error) {
				return reject(error)
			}
		})
	}

	async notifications(id) {
		return new Promise(async (resolve, reject) => {
			try {
				var data = await Notification.notification(id)
				console.log(">>>>>>>>>>>>>>>", data)
				return resolve(data)
			} catch (error) {
				return reject(error)
			}
		})
	}
}

module.exports = new User();