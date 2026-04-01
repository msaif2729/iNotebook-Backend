const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || "saif2729"

const fetchuser = (req,res,next)=>{

    const token = req.header('auth-token');
    
    if(!token)
    {
        return res.status(401).send({error:"Pls send correct token"})
    }

    try {
        
        const data = jwt.verify(token, JWT_SECRET)
        req.user=data.user
        next()

    } catch (error) {
        console.log({error})
        res.status(401).send({error:"Pls send correct token"})
    }

}

module.exports = fetchuser