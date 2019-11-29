const mongoose = require('mongoose')
const express = require('express')
const  router = new express.Router()
router.use(express.json())
const auth = require('../middleware/auth')
const Task = require('../models/tasks')


try{
    router.post('/tasks',auth,async (req,res)=>{
        console.log('+++++++++++++++++++++++++++++Create a new Task+++++++++++++++++++++++++++++')
        console.log(req.body)
        //create and save a New User
        //const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            owner : req.user._id
              })
        console.log('Body is here')
        // console.log('User data received \n', user)
        try{
            await task.save()
            
            return res.status(201).send(task)
        }catch(e)
        {
            return res.status(400).send('Unable to save : Issue occured\n'+e)
        }
        
        // task.save().then(()=>{
        //    return  res.status(201).send(task)
        // }).catch((e)=>{ 
        //    return res.status(400).send(e)
        //     //res.send(e)
        // })
    
    })
    }
    catch (e){
        console.log('catch Block Found',e)
         res.status(500).send(e)
    }


//GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
    router.get('/tasks',auth,async (req,res)=>{
        //console.log(req.query.completed)
        const match = {}
        const sort = {}
        if (req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy)
        { const parts = req.query.sortBy.split(':')
        console.log('sortBY found :' +parts)
        //console.log(parts.split(':'))
            sort[parts[0]] = parts[1] === 'desc' ?  -1 : 1
            console.log(sort)

        }
        
        try{
            //const tasks = await  Task.find({owner : req.user._id , match})
            /*ALternative to above: */
            await req.user.populate({path:'tasks',
            match,
            
            options:{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort:sort
                 
            }
        }).execPopulate()
            // if(!tasks){
                
            //     return res.status(404).send('No tasks generated')
            // }
            res.send(req.user.tasks)
        }
        catch(e){
            res.status(500).send(e) 
        }
        // Task.find({}).then((tasks)=>{
        //     if(!tasks){
        //         return res.status(404).send()
        //     }
        //     res.send(tasks)
        // }).catch((e)=>
        // {
        //     res.status(500)
        // })
    })

    router.get('/task/:id',auth,async (req,res)=>{
        console.log('ID :',req.params.id)
console.log('------------------------fetching my tasks--------------------------------------')
    console.log('USER : ',req.user)
        try{
            console.log('I am seaerching fr task')
            const task =await Task.find({_id :req.params.id, owner: req.user._id})
           
            //console.log('Task',task)
            if (!task){
               console.log('No Task found for ID :'+ req.params.id)
                return res.status(404).send({task})
            }
            else{
             console.log('Task found')
             res.send(task)}
        }catch(error)
        {
            
            console.log('Error :'+error)
            res.status(500).send(error)
        }
        // const id = Task.findById(req.params.id).then((tasks)=>{
        //    if (!task){
        //        return res.status(404).sendStatus()
        //    }
           
        //     res.send(tasks)
        // }).catch((e)=>{
        //     res.status(500).send()
        // })

    })
    router.patch('/tasks/:id',auth ,async (req,res)=>{
        //console.log('step 0')
        const allowed = ['description','completed']
        const reqUpdate = Object.keys(req.body)
        const isValid = reqUpdate.every((update)=>  allowed.includes(update))   //checking if the body passed is valid 
        if (!isValid){
            //console.log('Invalidated')
            return res.status(400).send('error: Invalid Update')
            
        }
        try{
            console.log('step 0.5 :' +req.user._id)
            const updateTask = await Task.findOne({_id:req.params.id, owner : req.user._id},req.body,{new: true,runValidators : true})
            //console.log('UpdateTask')
            //const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body,{new: true,runValidators : true})
            console.log('step2')
            if (!updateTask){
                console.log('Im at failed update')
                return res.status(400).send({'No task for the Id ':req.params.id})
                
            }
            reqUpdate.forEach((update)=>updateTask[update] = req.body[update])
            await updateTask.save()
            console.log('Im at successfull block')
            res.status(200).send(updateTask)
        }catch(e){
            console.log('Im at Catch block')
            res.status(500).send(e)
        }
    })

    
    
    router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        console.log('==============================DELETING the TASK==========================================\n')
                const task = await Task.findByIdAndDelete({_id:req.params.id,owner : req.user.owner})
                console.log('r_id : '+req.params.id+'\n Owner_id :'+req.user.owner)
                if (!task){
                    console.log('Task not found\n')
            return res.status(404).send('No Task found with ID :'+req.params.id)

        }
        res.send(task)
    }
    catch(e)
    {
        console.log('catching error')
        res.status(500).send(e)
    }
})
 
module.exports = router