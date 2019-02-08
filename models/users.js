const {mongoose} = require('../db/mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1,
        unique : true,
        validate : {
            validator : validator.isEmail,
            message : '{VALUE} is not a valid email'
        }
    },
    password : {
        type : String,
        require : true,
        minlength : 6,
    },
    tokens : [{
        access : {
            type: String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id','email']);
}

UserSchema.pre("save",function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
                if(!err){
                    user.password = hash;
                    next();
                }
            } )
        })
    } else next();
})

UserSchema.methods.generateAuthToken = function() {

    // instance method 
    var user = this;

    access = 'auth';
    token = jwt.sign({"id" : user._id.toHexString(), access}, '123abc').toString();
    user.tokens = user.tokens.concat([{access,token}]);
    
    return user.save().then(()=>{
        return token;
    });
}

UserSchema.statics.findByToken = function(token){
    console.log(token);
    var User = this;
    var decoded ; 
    try {
        decoded = jwt.verify(token,'123abc')
        console.log('decoded :' , JSON.stringify(decoded));
    } catch(e){
        return Promise.reject();
    }
    return User.findOne({
        '_id':decoded.id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}

var UserModel = mongoose.model('UserModel', UserSchema) 

module.exports = {
    UserModel
};