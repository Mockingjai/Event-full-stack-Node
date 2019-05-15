const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const User = require('../models/User');

// @    Method POST /users/register
// @    Register new user
// @    Public
router.post('/register', [
    //Validating email 'n' password fields
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
] , async (req, res) => {
    const {email , password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(401).send('Data is not valid');
    }

    try {
        // *Search user in db, if already exist throw an error
        let error = await User.findOne({ email });
        if(error) {
            return res.status(401).send('User is already exist');
        }
        //Creating new user
        let user = new User({
            email: email,
            password: password
        });

        //Crypt password with salt
        const salt = await bcrypt.genSalt(10);
        const newPassword = await bcrypt.hash(password, salt);

        user.password = newPassword;

        const payload = {
            user: {
                id: user._id
            }
        };

        //Saving new user to db
        await user.save();

        jwt.sign(payload,
            config.get("jwtSecret"),
            (err, token) => {
                if(err) { throw err; }
                res.status(200).json({ user, token })
            });
    } catch (e) {
        console.log(`${e.message}`);
        res.status(500).send('Server error');
    }
});
// @    Method GET /users/me
// @    Get access to account
// @    Public
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;