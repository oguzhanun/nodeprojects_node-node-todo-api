const {mongoose} = require('../db/mongoose.js');

var UserModel = mongoose.model('UserModel', {
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    }
});

module.exports = {
    UserModel
};