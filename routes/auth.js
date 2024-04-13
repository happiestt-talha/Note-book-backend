const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config()

const router = express.Router();
const User = require('../models/User');
const fetchUser = require('../middlewares/fetchUser');

router.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        user = await User.create({ name, email,asliPassword:password, password: hashedPassword });

        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({ message: "User created successfully",user, token }); // Return user details and token
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error", message: err.message });
    }
});





router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 5 }).withMessage('Password should be at least 5 characters long')
], async (req, res) => {

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }


        const chkPassword = await bcrypt.compare(req.body.password, user.password);
        console.log('Password', chkPassword);
        if (!chkPassword) {
            return res.status(400).json({ error: "password not correct" });
        }

        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({id: user._id, msg: "login successful", user, token });

    } catch (error) {
        res.json({
            message: "Some Error occures",
            ERROR: error.message
        })
    }
})





router.get('/getUser', fetchUser, async (req, res) => {
    try {

        const chkedUser = await User.findById(req.user.id).select("-password")
        res.json({message:"success",reqUser: req.user,id:req.user.id,chkedUser,chkedUserId:chkedUser.id})


    } catch (error) {
        res.json({
            title:"nawa katta",
            user: req.user,
            message: "Some Error occured in auth js , getUser",
            ERROR: error.message,
        })
    }
})


module.exports = router;
