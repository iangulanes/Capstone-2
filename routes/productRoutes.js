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
	// router.post ("/", auth.verify, (req, res) => {
	// 	productController.addProduct (req.body). then (resultFromController => res.send (resultFromController))
	// })

router.post("/", auth.verify, (req, res) => {

    const payload = auth.decode(req.headers.authorization);

    if (payload.isAdmin) {
        productController.addProduct(req.body).then((result) => res.send(result));
    } else {
         res.send("Unauthorized User.");
    }
});


//GET A SPECIFIC PRODUCT
router.get ("/:productId", (req, res) => {
	productController.getProduct (req.params.productId). then (resultFromController => res.send (resultFromController))
})


//UPDATE A PRODUCT (ADMIN ONLY)
router.put ("/:productId", auth.verify, (req, res) => {

   const payload = auth.decode(req.headers.authorization);

   if (payload.isAdmin) {
      productController.updateProduct (req.params.productId, req.body). then (resultFromController => res.send (resultFromController))
   } else {
         res.send("Unauthorized User.");
   }
})


//ARCHIVE A PRODUCT (ADMIN ONLY)
router.put ("/:productId/archive", auth.verify, (req, res) => {

   const payload = auth.decode(req.headers.authorization);

   if (payload.isAdmin) {
   productController.archiveProduct (req.params.productId). then (resultFromController => res.send (resultFromController))      
   } else {
         res.send("Unauthorized User.");
   }
})


//UNARCHIVE OR ACTIVATE A PRODUCT (ADMIN ONLY)
router.put ("/:productId/activate", auth.verify, (req, res) => {

   const payload = auth.decode(req.headers.authorization);
   
   if (payload.isAdmin) {
   productController.activateProduct (req.params.productId). then (resultFromController => res.send (resultFromController))      
   } else {
         res.send("Unauthorized User.");      
      }
})



module.exports = router;