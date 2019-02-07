const {mongoose} = require('../db/mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    access = 'auth';
    token = jwt.sign({id : user._id.toHexString(), access}, '123abc');
    user.tokens = user.tokens.concat([{access,token}]);
    
    return user.save().then(()=>{
        return token;
    });
}

var UserModel = mongoose.model('UserModel', UserSchema) 

module.exports = {
    UserModel
};