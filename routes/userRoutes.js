const express = require ("express");

const router = express.Router();

const userController = require ("../controllers/userController");

const auth = require ("../auth");

//REGISTER USER
router.post ("/register", (req, res) => {
	userController.registerUser (req.body).then (resultFromController => res.send (resultFromController));
})


//LOGIN USER
router.post ("/login", (req, res) => {
	userController.loginUser (req.body). then (resultFromController => res.send (resultFromController));
})



//GET ALL USERS (ADMIN ONLY)
router.get ("/", auth.verify, (req, res) => {

   const userData = auth.decode(req.headers.authorization);
   if (userData.isAdmin){
   		userController.getAllUsers ().then (resultFromController => res.send (resultFromController))
   } else {
   	res.send("Unauthorized User.");
   }
	
})


//CHECKOUT ORDERS (regular user)
//b146
/*
router.post("/checkout", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization)

    userController.checkout(userData, req.body)
        .then(result => {
            res.send(result.latestOrder)
        });
})
*/

//CHECKOUT ORDERS (regular user)
//Sir Alan
router.post("/checkout", auth.verify, (req, res) => {

   const userId = auth.decode(req.headers.authorization);

   if (userId.isAdmin == false){
    userController.checkout(userId.id, req.body).then(resultFromController => res.send(resultFromController))
   } else {
   		res.send("Unauthorized User.");
   }
})



//GET MY ORDERS (current user)
router.get("/myOrders", auth.verify, (req, res) => {

   const userData = auth.decode(req.headers.authorization);

   if (userData.isAdmin == false) {
		userController.getMyOrders (userData.id).then (resultFromController => res.send (resultFromController))
   } else {
   		res.send ("Unauthorized User.");
   }
	
})


//GET ALL ORDERS (ADMIN ONLY)
router.get ("/orders", auth.verify, (req, res) => {

	const userData = auth.decode (req.headers.authorization);

	if (userData.isAdmin) {
		userController.getAllOrders (userData). then (resultFromController => res.send (resultFromController))
	} else {
		res.send ("Unauthorized User.")
	}
})


//SET USER AS ADMIN (ADMIN ONLY)
router.put ("/:userId/setAsAdmin", auth.verify, (req, res) => {

   const userData = auth.decode(req.headers.authorization);

   if (userData.isAdmin) {
   userController.setAsAdmin (req.params.userId). then (resultFromController => res.send (resultFromController))      
   } else {
         res.send("Unauthorized User.");
   }
})



//UPDATE USER DETAILS
router.put('/:userId/edit', auth.verify, (req, res) => {

	userController.editDetails(req.params.userId, req.body).then(result => res.send(result))
})



//DELETE A USER
router.delete("/deleteUser", auth.verify, (req, res) => {

	userController.deleteUser(req.body.email).then(result => res.send(result))
})


module.exports = router;