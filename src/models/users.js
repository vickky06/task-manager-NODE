const mongoose = require('mongoose')
const validator = require('validator')


// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);

///creating models
//user Model
//mongoose.model takes 2 argumenst--name of the models and hte fields in the models.
const User = mongoose.model('User',{
    name : {
        type : String,
        required : true,
        trim: true
    },
    email: {
        type : String,
        required : true,
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

    }
})

//Export this
module.exports = User