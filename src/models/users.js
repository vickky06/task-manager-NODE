
const Task = require ('../models/tasks')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

///creating models
//user Model
//mongoose.model takes 2 argumenst--name of the models and hte fields in the models.

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true
    },
    email: {
        type : String,
        required : true,
        unique: true,
        trim: true,
        lowercase : true, 
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid Email')

            }
        }

    },
    password:{
        type: String,
        required : true,
        trim : true,
        minlength : 7,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error ( 'Passwor can not contain "Password"!!')
            }
        }  
    },
    age : {
        type : Number,
        default : 0,
        validate (value){
                if (value<0){
                    throw new Error('Age must be positive')
                }
        }

    },
    avatar:{
        type:Buffer

    },
    tokens : [{
        token :{
            type : String,
            required : true
        }
        
    }]
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField:'_id',
    foreignField:'owner'
})
//login function
userSchema.statics.findUserByCredentials = async(email,password)=>{
    const user = await User.findOne({email})
    const error ='Invalid User ID password'
    if(!user){
        throw new Error(error)
    }
   // console.log('searching user : found \n'+user)

    const isValid = await bcrypt.compare(password,user.password)
    if (!isValid){
        throw new Error(error)
    }
    //console.log('Password matched')
    return user
}
///toJSON
userSchema.methods.toJSON = function(){
    const user =this
    const userObj = user.toObject()
    
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar

    return userObj
}


//Token generation
userSchema.methods.generateAuthToken = async function(){
    const user = this
    console.log('WE ARE HERE '+process.env.JWT_TOKEN)
    const token = jwt.sign({_id : user._id.toString() },process.env.JWT_TOKEN)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
    
}

//hasing passsword
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        //console.log('Password change activated')
        //console.log('password before'+user.password)
        user.password = await bcrypt.hash(user.password,8)
        //console.log('password after : '+user.password )
        
    }
    //restructured User router
    //console.log('Pre is running')
    next()
})

//to delete ALL THE tasks of a user when user deletes himself.
userSchema.pre('remove',async function(next)
{const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User',userSchema)

//Export this
module.exports = User