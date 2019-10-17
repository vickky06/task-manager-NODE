const express = require('express')
require('./db/mongoose')

const User = require('./models/users')
const app = express()

 require('./db/mongoose')


//for deployment

const port =  process.env.PORT || 3000
///customize express to parse Json
app.listen(port, () => {
    console.log('server is running on Port '+port)

} )

app.use(express.json())

///get and Post setting
//syntex: -> express_obj.HTTPrequest('URL',callback(req,res)=>{})   <-

try{
app.post('/users',(req,res)=>{
    //create and save a New User

    const user = new User(req.body)
    console.log('User data received \n', user)
    
    user.save().then(()=>{
       console.log('saving')
       const SaveUserser = new User(req.body)
       return SaveUserser.save();
    }).then(function(){
        console.log('data saved')
    }).catch((error)=>{
        console.log('NOT saved')
        res.send('Not saved')
            });
    
    
    
    
    //console.log('data received')
    //console.log(req.body)
    console.log('First Saving')
})
}
catch (e){
    console.log('catch Block Found',e)
    return res.send('failed')
}
finally{
    console.log('Stopping')
}
