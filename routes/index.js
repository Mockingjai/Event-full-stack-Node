const express = require('express');
const router = express.Router();

const LogginngMiddlware = ( req, res, next ) => {
  console.log(`Logged URL: ${req.url} Method: ${req.method} --> When: ${new Date()}`);
  next();
};

router.use(LogginngMiddlware);

/* GET home page. */
router.get('/:id', (req, res) => {
  res.json({
    'status': true,
    'id': req.params.id,
  });
});

module.exports = router;
