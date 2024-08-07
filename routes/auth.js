const express = require('express')
const router = express.Router()
const Users = require('../models/Users')

router.post('/',(req, res)=>{
    console.log(req.body)
    const user = Users(req.body)
    user.save()
    res.json(req.body)
});

module.exports = router