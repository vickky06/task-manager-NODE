const mongoose = require('mongoose')
//const validator = require('validator')
Promise = require('bluebird');
mongoose.Promise = Promise;
const serverOptions = {
    poolsize:100 ,
    socketOptions:{
        socketTimeoutMS: 5000
        }};
//connect to the database, UrlParser is true, create Index for databse automaticaclly

require('mongoose').Promise = global.Promise
mongoose.createConnection('mongodb://127.0.0.1:27017/task-manager-api',{
    'useNewUrlParser': true,
    'useFindAndModify':false,
    'useCreateIndex': true,
    'useUnifiedTopology': true,
   // server: serverOptions
});


///Creating Models
//Task Model
const Task = mongoose.model('Task',{
    description :{
        type : String,
        required : true,
        trim : true
    },
    completed : {
        type : Boolean,
        required : false,
        default : false

    }

})





/***************************************************************************************************************************************/
///Creating a sample Task
// const sampleTask = new Task({
//     description : 'This is a sample Task',
//     completed : false
// })

// sampleTask.save().then(()=>{
//     console.log(sampleTask)
// }
// ).catch((error)=>{
//     console.log('Error Occured as : ',error)

// })

/***************************************************************************************************************************************/
//creating a sample user
// const me = new User({
//     name: 'Werror',
//     age : 'error age'
// })

// me.save().then(()=>{
//     console.log(me)

// }).catch((error)=>
//     {
//         console.log('Error : ',error)
//     }
// )




