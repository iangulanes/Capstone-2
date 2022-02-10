const User = require ("../models/User");
const Product = require ("../models/Product");
const auth = require ('../auth')

const bcrypt = require ("bcrypt")


//REGISTER USER
/*
module.exports.registerUser = (reqBody) => {
	const {email, password} = reqBody

	const newUser = new User ({
		email: email,
		password:bcrypt.hashSync(password, 10)
	})

	return newUser.save ().then ((result, error) => {
		if (result) {
			return true 
		} else {
			return error
		}
	})
}
*/

//REGISTER USER (do not accept duplicate email)
module.exports.registerUser = (reqBody) => {
	return User.findOne ({email: reqBody.email}).then ((result, error) => {
		if (result !== null && result.email == reqBody.email) {
			return 'Email already registered!'
		} else {
			const {email, password} = reqBody

			const newUser = new User ({
				email: email,
				password: bcrypt.hashSync (password, 10)
			})

			return newUser.save (). then ((result, error) => {
				if (result) {
					return 'New user successfully created.'
				} else {
					return error
				}
			})
		}
	})
}

//LOGIN USER
module.exports.loginUser = (reqBody) => {
	const {email, password} = reqBody

	return User.findOne ({email: email}). then ((result, error) => {
		if (result == null){
			return `User unregistered.`
		} else {
			let isPwCorrect = bcrypt.compareSync(password, result.password)
			if (isPwCorrect == true) {
				return {access: auth.createAccessToken (result)}
			} else {
				return false
			}
		}
	})
}


//GET ALL USERS (ADMIN ONLY)
module.exports.getAllUsers = () => {
	return User.find().then ((result, error) => {
		if (result) {
			return result
		} else {
			return error
		}
	})
}



//CHECKOUT ORDERS (regular user)
//Sir Alan
module.exports.checkout = (userId, cart) => {
	return User.findById (userId).then (user => {
		if (user === null){
			return false
		} else {
			//push the contents of the cart to user.orders
			user.orders.push ({
				products:cart.products,
				totalAmount: cart.totalAmount
			})
			return user.save().then ((updatedUser, error) => {
				if (error) {
					return false
				} else {
					const currentOrder = updatedUser.orders[updatedUser.orders.length-1]
					currentOrder.products.forEach (product => {
						Product.findById(product.productId)
						.then (foundProduct => { 
							foundProduct.orders.push({orderId:currentOrder._id})
							foundProduct.save()

						})
					})
					return true
				}
			})
		}
	})
}


// //CHECKOUT ORDERS (regular user)
// module.exports.checkout = async (userData, cart) => {
//         //verification
//         if (userData.isAdmin == false) {

//             //save newOrder from user to database
//             const newOrder = await User.findByIdAndUpdate(userData.id, { $addToSet: { orders: cart } }, { new: true })

//             //get latest order from user
//             const latestOrder = newOrder.orders[newOrder.orders.length - 1]
//             const orderId = latestOrder._id

//             let productId
//             let productDetail
//             for (let i = 0; i < cart.products.length; i++) {
//                 //find Product using product ID from cart.products[0].productId
//                 productId = cart.products[i].productId
//                 //save latest order id from user to Product.orders Array
//                 productDetail = await Product.findByIdAndUpdate(productId,
//                     { $addToSet: { orders: [{ orderId }] } }, { new: true })
//             }

//             return {
//                 "productDetails": productDetail,
//                 "latestOrder": latestOrder
//             }
//         } return "Unauthorized User."
//     }


//GET ALL ORDERS (ADMIN ONLY)
module.exports.getAllOrders = async (userData) => {
        if (userData.isAdmin == true) {

            const allOrders = await User.find().select("-password -isAdmin -__v")
            let allActiveOrders = []

            for (let i = 0; i < allOrders.length; i++) {
                if (allOrders[i].orders.length >= 1) {
                    allActiveOrders.push(allOrders)
                }
            }

            return allActiveOrders

        } return "Unauthorized User."
    }




//GET MY ORDERS (logged in user only, non-admin)
module.exports.getMyOrders = (userId) => {
	return User.findById (userId).then ( user => {
		if (user === null){
			return false
		} else {
			return user.orders
		}
	})
}


//SET USER AS ADMIN (ADMIN ONLY)
module.exports.setAsAdmin = (params) => {
	return User.findByIdAndUpdate(params, {isAdmin: true}, ).then((result, error) => {
		if(result == null){
			return `User not existing.`
		} else {
			if(result){
				return "User set as Admin."
			} else {
				return false
			}
		}
	})
}



//UPDATE USER DETAILS
module.exports.editDetails = (userId, reqBody) => {
	
	const {email, password} = reqBody

	const updateUser = {
		email: email,
		password: bcrypt.hashSync(password, 10)
	}

	return User.findByIdAndUpdate(userId, updateUser, {new: true}).then((result, error) => {
		// console.log(result)
		if(error){
			return error
		} else {
			return "User details successfully updated."
		}
	})
}


//DELETE A USER
module.exports.deleteUser = (email) => {

	//look for matching document in the database && delete the matching document
	return User.findOneAndDelete({email: email}).then( (result, error) => {

		if(result == null){
			return `User not existing.`
		} else {
			if(result){
				// return true if delete 
				return `User successfully deleted.`
			} else {
				// return error if error
				return error
			}
		}
	})
}

