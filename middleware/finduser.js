const jwt = require('jsonwebtoken')


const fetchuser = (req,res,next)=>{

    const token = req.header('auth-token');
    const JWT_SIGN = "saif2729"
    
    if(!token)
    {
        return res.status(401).send({error:"Pls send correct token"})
    }

    try {
        
        const data = jwt.verify(token,JWT_SIGN)
        req.user=data.user
        next()

    } catch (error) {
        console.log({error})
        res.status(401).send({error:"Pls send correct token"})
    }

}

module.exports = fetchuser