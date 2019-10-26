// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// const connectionUURL= 'mongodb://127.0.0.1:27017'
// const databaseName = 'task-manager'

// MongoClient.connect(connectionUURL, {useUnifiedTopology: true}, (error,client)=>{
// if (error){
//     return console.log('unable to connect to DB')
// }
// else{
//     console.log('DB connection established')
//     const db = client.db(databaseName)
// //     db.collection('users').insertOne({
// //         name: 'vivek',
// //         age:23
// //     },(error, result)=>{
     
// //      if (error){
// //         return console.log('Unable to insert User');
// //     }
// //     console.log(result.ops)
// // }
// //     )

// // db.collection('users').insertMany(
// //    [ {
// //         name : 'Jen',
// //         age:23

// //     },
// //     {
// //         name : 'Gintu',
// //         age:23

// //     }
// // ],(error,result)=>{
// // if (error){
// //     return console.log('unable to insert document')
// // }
// // console.log(result.ops)

// // }
// // )
// db.collection('tasks').insertMany( [
// {
//         description : 'Clean the House',
//         completed: true
//     },
//      {

//             description : 'Complete Tutorials',
//             completed: false

//     },
//     {

//             description : 'Go work',
//             completed: false

//     }

//     ],(error, result)=>{
//         if (error){
//             return console.log('Insertion failed')
//         }
//         console.log('insertion successfull')
//         console.log(result.ops)
//     }
//     )
// }


// })