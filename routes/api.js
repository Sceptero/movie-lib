const express = require('express');
const router = express.Router();

router.all("/", (req,res) => { res.send("TEST")});

module.exports = router;