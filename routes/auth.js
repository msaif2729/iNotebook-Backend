const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const Users = require('../models/Users')
const jwt = require('jsonwebtoken')
const { query, body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/finduser');

const JWT_SECRET = process.env.JWT_SECRET;


//Creating a new user
router.post('/createuser', [
    //Validation the inputs 
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid Username").isEmail(),
    body('pass', "Enter a valid Password").isLength({ min: 5 }),
    body('pass', "Enter a valid Password").isLength({ max: 15 })
], async (req, res, next) => {

    try {

        //in the result we get the validated result
        const result = validationResult(req);
        if (!result.isEmpty()) {
            const error = new Error("Validation failed");
            error.status = 400;
            error.errors = result.array();
            return next(error);
        }


        let user = await Users.findOne({ $or: [{ email: req.body.email }, { pass: req.body.pass }] });
        if (user) {
            const error = new Error("Sorry a user with this email/pass already exists");
            error.status = 400;
            return next(error);
        }


        //Password Hashing using the bcrypt 
        //Creating the salt(random genereted string) 
        const salt = await bcrypt.genSalt(10);
        //Creating the hash of the password and appending the salt
        const secpass = await bcrypt.hash(req.body.pass, salt);


        //Create the user in the User DB by getting the request from the body
        user = await Users.create({
            name: req.body.name,
            email: req.body.email,
            pass: secpass
        })


        const data = {
            user: {
                id: user._id
            }
        }

        //generatin the authentication token 
        const authtoken = jwt.sign(data, JWT_SIGN);
        // console.log(authtoken)
        res.json({success:true, authtoken })



    } catch (error) {
        return next(error);
    }
});


router.post('/login', [
    //Validation the inputs 
    body('email', "Enter a valid Username").isEmail(),
    body('pass', "Enter a valid Password").exists()
], async (req, res, next) => {

    const {email,pass} = req.body;

    const result = validationResult(req);
    if (!result.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.errors = result.array();
        return next(error);
    }

    try {
        const user = await Users.findOne({email})
        if(!user)
        {
            const error = new Error("Incorrect Credentials");
            error.status = 401;
            return next(error);
        }
        
        const passcmp = await bcrypt.compare(pass,user.pass)
        if(!passcmp)
        {
            const error = new Error("Incorrect Credentials");
            error.status = 401;
            return next(error);
        }

        const data = {
            user: {
                id: user._id
            }
        }
        //generatin the authentication token 
        const authtoken = jwt.sign(data, JWT_SIGN);
        // console.log(authtoken)
        res.json({success:true, authtoken })


    } catch (error) {
        console.log(error.message)
        return next(error);
    }

});



router.post("/getuser",fetchuser,async (req,res,next)=>{

    try {
        const userID = req.user.id;
        const user = await Users.findOne({_id:userID},{pass:0})
        res.json(user)


    } catch (error) {
        console.log({error})
        return next(error);
        
    }

})

module.exports = router