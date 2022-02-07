const User = require ("../models/User");
const Product = require ("../models/Product");
const auth = require ('../auth')

const bcrypt = require ("bcrypt")


//REGISTER USER
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

//LOGIN USER
module.exports.loginUser = (reqBody) => {
	const {email, password} = reqBody

	return User.findOne ({email: email}). then ((result, error) => {
		if (result == null){
			return false
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