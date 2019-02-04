const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://elsamsuni:elsamsuni55@ds221645.mlab.com:21645/todoapp" || "mongodb://localhost:27017/TodoApp",{ useNewUrlParser: true }).then(()=>{
    console.log("Connected to Database...")   
});

module.exports = {mongoose};