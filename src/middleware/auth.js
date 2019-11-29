const jwt =require('jsonwebtoken')
const User = require('../models/users')

module.exports= auth = async (req,res,next) =>{
   //console.log('auth running');
   try{
    const token = req.header('Authorization').replace('Bearer ','')
    console.log(process.env.JWT_TOKEN)
    const decode = jwt.verify(token,process.env.JWT_TOKEN)
    console.log('decode \n'+decode)
    const user = await User.findOne({_id: decode._id, 'tokens.token':token})
    if(!user){
        throw new Error({error : 'Please authenticate'})
    }
    req.token = token
    req.user = user
    next();
   }catch (e){
    res.status(500).send({error : 'Please authenticate'})
   }

}