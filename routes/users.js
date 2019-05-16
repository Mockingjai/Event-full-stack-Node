const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const _crypt = require('../helpers/crypt-password');
const User = require('../models/User');

// @    Method POST /users/register
// @    Register new user
// @    Public
router.post('/register', [
    //Validating form
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
        const newPassword = await _crypt(password);
        user.password = newPassword;
        //Add new user to db
        await user.save();
       res.status(200).json(user);
    } catch (e) {
        console.log(`${e.message}`);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    let user = User;
    const { email, password } = req.body;
    try {
        const find = await User.findOne({ email });
        const payload = {
            user: {
                id: find._id
            }
        };
        //Giving jwt to user
        jwt.sign(payload,
            config.get("jwtSecret"),
           async (err, token) => {
                if(err) { throw err; }
                //Decrypt password and compare them
                 await bcrypt.compare(password, find.password, (err, result) => {
                   if(err) {
                       res.json(err);
                    }
                    //If passwords is equal give to the user token
                    res.status(200).json({ token });
               });
            });
    } catch (e) {
        console.log(e.message);
    }
});

// @    Method GET /users/me
// @    Get access to account
// @    Public
router.get('/me', auth, async (req, res) => {
    try {
        //Get access to the home page of the user
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (e) {
        console.log(e.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;