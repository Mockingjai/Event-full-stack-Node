const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

router.post('/register', [
    check('email').isEmail(),
    check('password').isLength({min: 6}),
] , async (req, res) => {
    const {email , password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(401).send('Un-correct data');
    }

    try {
        let error = await User.findOne({ email });
        if(error) {
            return res.status(401).send('User is already exist');
        }

        let user = new User({
            email: email,
            password: password
        });

        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);
        user.password = newPassword;

        await user.save();
        res.status(200).json(user);
    } catch (e) {
        console.log(`${e.message}`);
        res.status(500).send('Server error');
    }
});

module.exports = router;