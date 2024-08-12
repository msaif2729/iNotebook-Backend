const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const Users = require('../models/Users')
const jwt = require('jsonwebtoken')
const { query, body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/finduser');


const JWT_SIGN = "saif2729"


//Creating a new user
router.post('/createuser', [
    //Validation the inputs 
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid Username").isEmail(),
    body('pass', "Enter a valid Password").isLength({ min: 5 }),
    body('pass', "Enter a valid Password").isLength({ max: 15 })
], async (req, res) => {

    try {

        //in the result we get the validated result
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send({ errors: result.array() });
        }


        let user = await Users.findOne({ $or: [{ email: req.body.email }, { pass: req.body.pass }] });
        if (user) {
            //Show Error mssg if the user with the details already exist
            return res.status(400).json({ error: "Sorry a user with this email/pass is already exists" })
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
        res.json({ authtoken })



    } catch (error) {
        res.status(500).json({ errormssg: "Something went wrong" + error })
    }
});


router.post('/login', [
    //Validation the inputs 
    body('email', "Enter a valid Username").isEmail(),
    body('pass', "Enter a valid Password").exists()
], async (req, res) => {

    const {email,pass} = req.body;

    const result = validationResult(req);
    if(!result)
    {
        return res.send({error:result.array()})
    }

    try {
        const user = await Users.findOne({email})
        if(!user)
        {
            return res.send({error:"Incorrect Credentials"})    
        }
        
        const passcmp = await bcrypt.compare(pass,user.pass)
        if(!passcmp)
        {
            return res.send({error:"Incorrect Credentials"})    
        }

        const data = {
            user: {
                id: user._id
            }
        }
        //generatin the authentication token 
        const authtoken = jwt.sign(data, JWT_SIGN);
        // console.log(authtoken)
        res.json({ authtoken })


    } catch (error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }

});



router.post("/getuser",fetchuser,async (req,res)=>{

    try {
        const userID = req.user.id;
        const user = await Users.findOne({_id:userID},{pass:0})
        res.json(user)


    } catch (error) {
        console.log({error})
        res.status(500).send({error:"Internal Error"})
        
    }

})

module.exports = router