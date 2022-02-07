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

module.exports = router;