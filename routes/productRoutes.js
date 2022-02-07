const express = require ("express");

const router = express.Router();

const auth = require ('../auth')

const productController = require ("../controllers/productController");


 // GET ALL PRODUCTS
    router.get("/all", (req, res) => {
        productController.getAll()
        .then(resultFromController => res.send(resultFromController));
    })



 // GET ALL ACTIVE PRODUCTS
    router.get("/active", (req, res) => {
        productController.getAllActive()
        .then(resultFromController => res.send(resultFromController));
    })




//ADD A PRODUCT (ADMIN ONLY)
	router.post ("/", auth.verify, (req, res) => {
		productController.addProduct (req.body). then (resultFromController => res.send (resultFromController))
	})



//GET A SPECIFIC PRODUCT
router.get ("/:productId", auth.verify, (req, res) => {
	productController.getProduct (req.params.productId). then (resultFromController => res.send (resultFromController))
})


//UPDATE A PRODUCT (ADMIN ONLY)
router.put ("/:productId", (req, res) => {
	productController.updateProduct (req.params.productId, req.body). then (resultFromController => res.send (resultFromController))
})


//ARCHIVE A PRODUCT (ADMIN ONLY)
router.put ("/:productId/archive", auth.verify, (req, res) => {
	productController.archiveProduct (req.params.productId). then (resultFromController => res.send (resultFromController))
})


//UNARCHIVE OR ACTIVATE A PRODUCT (ADMIN ONLY)
router.put ("/:productId/activate", auth.verify, (req, res) => {
	productController.activateProduct (req.params.productId). then (resultFromController => res.send (resultFromController))
})



module.exports = router;