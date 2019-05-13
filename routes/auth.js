var express = require('express');
var router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
    res.send('Test auth')
    // next();
});

module.exports = router;