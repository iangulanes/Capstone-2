const User = require ("../models/User");
const Product = require ("../models/Product");
const auth = require ('../auth')
const bcrypt = require ('bcrypt')



// GET ALL PRODUCTS
module.exports.getAll = () => {
	return Product.find().then ((result, error) => {
if (result !==null){
			return result
		} else {
			return result
		}
	})
}

// GET ACTIVE PRODUCTS
module.exports.getAllActive = (reqBody) => {
	return Product.find({ isActive: true }).then ((result, error) => {
		if (error){
			return false
		} else {
			return result
		}
	})
}


//ADD A PRODUCT (ADMIN ONLY)
/*
module.exports.addProduct = (reqBody) => {
	let newProduct = new Product ({
		name: reqBody.name,
		description: reqBody.description,
		price: reqBody.price
	})
	return newProduct.save().then ((result, error) => {
		if (error){
			return false
		} else {
			return result
		}
	})
}
*/

//ADD A PRODUCT (ADMIN ONLY, do not accept duplicate product.)
module.exports.addProduct = (reqBody) => {
	return Product.findOne ({name: reqBody.name}).then ((result, error) => {
		if (result !== null && result.name == reqBody.name) {
			return 'Duplicate product found!'
		} else {
			let newProduct = new Product ({
				name: reqBody.name,
				description: reqBody.description,
				price: reqBody.price
			})
			return newProduct.save ().then ((result, error) => {
				if (error) {
					return false
				} else {
					return 'New product successfully added.'
				}
			})
		}
	})
}


//GET A SPECIFIC PRODUCT
module.exports.getProduct = (params) => {
	return Product.findById (params).then ((result, error) => {
		if (result == null) {
			return "Product not existing"
		} else {
			if (result) {
				return result 
			} else {
				return error
			}
		}
	})
}


//UPDATE A PRODUCT (ADMIN ONLY)
module.exports.updateProduct = (id, reqBody) => {
	
	const {name, description, price} = reqBody

	let updatedProduct = {
		name: name,
		description: description,
		price: price
	}
	
	return Product.findByIdAndUpdate (id, updatedProduct, {new: true}).then ((result, error) => {
		if (error) {
			return error
		} else {
			return result
		}
	})
}


//ARCHIVE A PRODUCT (ADMIN ONLY)
module.exports.archiveProduct = (params) => {
	return Product.findByIdAndUpdate(params, {isActive: false}, ).then((result, error) => {
		if(result == null){
			return `Product not existing.`
		} else {
			if(result){
				return "Product Deactivated."
			} else {
				return false
			}
		}
	})
}


//UNARCHIVE OR ACTIVATE A PRODUCT (ADMIN ONLY)
module.exports.activateProduct = (params) => {
	return Product.findByIdAndUpdate(params, {isActive: true}).then( (result, error) => {
		if(result == null){
			return `Product not existing`
		} else {
			if(result){
				return "Product Activated."
			} else {
				return false
			}
		}
	})
}


//DELETE A PRODUCT (Admin Only)
module.exports.deleteProduct = (name) => {

	//look for matching document in the database && delete the matching document
	return Product.findOneAndDelete({name: name}).then( (result, error) => {

		if(result == null){
			return `Product not existing.`
		} else {
			if(result){
				return `Product successfully deleted.`
			} else {
				return error
			}
		}
	})
}
