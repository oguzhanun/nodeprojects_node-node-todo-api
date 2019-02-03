const mongoose = require('mongoose')

var UserModel = mongoose.model('Users', {
    email : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    }
})

module.exports = {
    UserModel
}