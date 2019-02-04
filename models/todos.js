const {mongoose} = require('../db/mongoose.js');

var TodoModel = mongoose.model('TodoModel', {
    text : {
        type : String,
        required : true,
        trim : true,
        minlength : 1
    },
    completed : {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Number,
        default : null
    }
});

module.exports = {
    TodoModel
};