const express = require('express')
const mongoose = require('mongoose')
require('./db/mongoose')
const app = express()
const userRouter = require('./router/user')
const taskRouter = require('./router/tasks')


app.use(userRouter)
app.use(taskRouter)
//for deployment
//console.log('DEV post is '+process.env.PORT)
const port =  process.env.PORT
 require('./db/mongoose')

///customize express to parse Json
app.listen(port, () => {
    console.log('server is running on Port '+ port)

} )

app.use(express.json())    //parse json to obj
