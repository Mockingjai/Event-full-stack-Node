var express = require('express');
var router = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
    res.send('Test posts')
    // next();
});

module.exports = router;