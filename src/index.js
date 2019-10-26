const express = require('express')
require('./db/mongoose')
const User = require('./models/users')
const Task = require('./models/tasks')
const app = express()
//for deployment
const port =  process.env.PORT || 3000
 require('./db/mongoose')

///customize express to parse Json
app.listen(port, () => {
    console.log('server is running on Port '+ port)

} )

app.use(express.json())    //parse json to obj

///get and Post setting
//syntex: -> express_obj.HTTPrequest('URL',callback(req,res)=>{})   <-



/***************************POST***********************/
try{
app.post('/users',(req,res)=>{
    //console.log(req.body)
    //create and save a New User

    const user = new User(req.body)
    // console.log('User data received \n', user)
    
    user.save().then(()=>{
       return  res.status(201).send(user)
    }).catch((e)=>{
       return res.status(400).send(e)
        //res.send(e)
    })

})
}
catch (e){
    console.log('catch Block Found',e)
     res.status(500).send(e)
}


try{
    app.post('/tasks',(req,res)=>{
        //console.log(req.body)
        //create and save a New User
    
        const task = new Task(req.body)
        // console.log('User data received \n', user)
        
        task.save().then(()=>{
           return  res.status(201).send(task)
        }).catch((e)=>{ 
           return res.status(400).send(e)
            //res.send(e)
        })
    
    })
    }
    catch (e){
        console.log('catch Block Found',e)
         res.status(500).send(e)
    }

    /***********************GET**********************/
/*USER fetching**/
    app.get('/users',(req,res)=>
    {
        User.find({}).then((users)=>{
                res.send(users)
        }).catch((e)=>
        {   
            res.set(500).send(e)      }) 
    })


    app.get('/user/:id',(req,res)=>{
        //console.log(req.params.id)
        const _id = req.params.id
        User.findById(_id).then((user)=>{
            if (!user){
                return res.status(404).send()
            }

            res.send(user)

        }).catch((e)=>{
            res.status(500).send()
        })
         

    })


    /**TASK fetching */

    app.get('/tasks',(req,res)=>{
        Task.find({}).then((tasks)=>{
            if(!tasks){
                return res.status(404).send()
            }
            res.send(tasks)
        }).catch((e)=>
        {
            res.status(500)
        })
    })

    app.get('/task/:id',(req,res)=>{
        Task.findById(req.params.id).then((tasks)=>{
           if (!task){
               return res.status(404).sendStatus()
           }
           
            res.send(tasks)
        }).catch((e)=>{
            res.status(500).send()
        })

    })



