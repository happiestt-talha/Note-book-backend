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
        // if (user) {
        //     return res.status(400).json({ error: "User already exists" });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        user = await User.create({ name, email, password: hashedPassword });

        // Generate JWT token for authentication
        const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({ user, token }); // Return user details and token
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

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);

        res.json({ msg: "login successful", user, token });
    } catch (error) {
        res.json({
            message: "Some Error occures",
            ERROR: error.message
        })
    }
})
router.get('/getUser', fetchUser, async (req, res) => {
    try {
        let userID=req.user.userId
        console.log(userID)
        const user = await User.findById(userID).select("-password")
        console.log(user)
        res.json({ user })
    } catch (error) {
        res.json({
            title:"nawa katta",
            user: req.user,
            message: "Some Error occures",
            ERROR: error.message,
        })
    }
})
module.exports = router;
