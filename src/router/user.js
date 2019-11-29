const sharp = require('sharp')
const multer = require('multer')
const auth = require('../middleware/auth')
const express = require('express')
const  router = new express.Router()
router.use(express.json())
const User = require('../models/users')
const { sendWelcomeEmails,sendCancellationmails } = require('../emails/account')



const upload = multer(
    
    {
    
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('file must be a jpg/jpeg/png'))
        }
        return cb(undefined,true)
    }
})



router.get('/users/me', auth , async (req,res)=>{
console.log('***********************My user**************************')
res.send(req.user)
console.log(req.user.name)
})


// router.get('/user/:id',async (req,res)=>{
//     console.log('Reading Users for ID :'+req.params.id)
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id);
//         if (!user){
//             const body = 'No users found by the ID : '+_id
//             return res.status(404).send(body)
//         }

//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
//     // User.findById(_id).then((user)=>{
//     //     if (!user){
//     //         const body = 'No users found by the ID : '+_id
//     //         return res.status(404).send(body)
//     //     }

//     //     res.send(user)

//     // }).catch((e)=>{
//     //     res.status(500).send(e)
//     // })
     

// })


router.post('/users/login',async (req,res)=>
{console.log('**********************************************Login*******************************************\n')
//console.log(req.body)
    try {
        const user = await User.findUserByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        //console.log(user)
        res.send({user,token})
    }
    catch(error)
    {  console.log('issue \n'+error)
 
        res.status(400).send({error})
    }
}
)
//LogOut
router.post('/users/logout',auth, async(req,res)=>{
    try{
        console.log('***************************Logout*************************************************\n')
        req.user.tokens = req.user.tokens.filter((token)=>
        {
            return token.token!==req.token
        })
        await req.user.save()
        res.send({'status':'Logout successfull!!'})
    }
catch(e){

req.status(500).send()
}
})

//LogOut all

router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        console.log('************************************LogOutAll**************************************\n')
        req.user.tokens = []
        await req.user.save()
        res.send({'status':'Loged out from all devices '})
    }
    catch(e){
        res.status(500).send()
    }

})
/*********************** */
router.patch('/users/me', auth,async (req,res)=>{
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Updating USER~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('Patching Users for '+req.user.id+' ID')
    const allowed = ['name','email','password','age']
    
    const reqUpdate= Object.keys(req.body)
    console.log('Update Body'+reqUpdate)
    const isValid = reqUpdate.every((update)=>  allowed.includes(update))   //checking if the body passed is valid 
   //console.log(isValid)
    if (!isValid){
        //console.log('nvalidated')
        return res.status(400).send('error: Invalid Update')
    }

    try{
       
        console.log('User check begin ')
      // const user = await User.findById(req.params.id)
      const user =req.user
        console.log('user found :'+ user.name)
       reqUpdate.forEach((update)=> user[update] = req.body[update]       )
       await user.save()
       // const updateUser =await  User.findByIdAndUpdate(myObjectIdString ,req.body,{new: true,runValidators : true})
        // console.log('User check')
        // console.log('updateUser :',updateUser)
            
        //console.log('User found')
            res.send(user)
    
    }catch(e){
       console.log('Catch Block'+e)
        res.status(500).send(e)
    }

})


router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    console.log('---------------------------------------------------Adding avatar to you---------------------------------------------------')
    const buffer =  await sharp(req.file.buffer).png().resize({width:250 ,height:250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{res.status(400).send({'error':'error while upload'})})


router.delete('/users/me/avatar',auth,async(req,res)=>{
    console.log('---------------------------------------------------Deleting avatar for you---------------------------------------------------')
    if (!req.user.avatar){
        res.send({'Status':'No file to delete'})
    }
    else{
    req.user.avatar = undefined
    await req.user.save()
    
    res.send({'Status':'Deletion was sucessfull'})
}},(error,req,res,next)=>{res.status(400).send({'error':'error while deletion'})})

router.get('/users/:id/avatar',async(req,res)=>{
    console.log('---------------------------------------------------Sending avatar for you---------------------------------------------------')
    console.log('Reading Users for ID :'+req.params.id)
    const _id = req.params.id
    try {
        const user = await User.findById(_id);
        if (!user || !user.avatar){
            throw new Error()
        }
   res.set('Content-Type','image.png')
   res.send(user.avatar)

    }
        catch (e){
            res.status(404).send()
        }

        
})



router.delete('/users/me',auth,async (req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user.id)
        // if(!user){
        //     return res.status(404).send('No user found with ID :'+req.params.id)
        // }
        console.log('---------------------------------------------------DELETING USER---------------------------------------------------')
        console.log('req.user : pre removal :'+req.user.name)
        await req.user.remove();
      //  sendCancellationmails(req.user.email,req.user.name)
        console.log('req.user : post removal :'+req.user.name)
        console.log('deletion successfull')
        res.send(req.user)
    }catch (e)
    {
        res.status(500).send(e)
    }

})


router.post('/users',async (req,res)=>{
    console.log('******************************************************************SIGN UP**************************************************\n')
    //create and save a New User

    const user = new User(req.body)
    console.log(user)

    try{
    // console.log('User data received \n', user)
    await user.save()
   // sendWelcomeEmails(user.email, user.name)
    const token = await user.generateAuthToken()
    console.log('Sign Up successfull')
    res.status(201).send({user,token})
}
catch (e){
    //onsole.log(' catch Block Found')
     res.status(400).send(e)
}
    
    // user.save().then(()=>{
    //    return  res.status(201).send(user)
    // }).catch((e)=>{
    //    return res.status(400).send(e)
    //     //res.send(e)
    // })


})

module.exports=router