const {TodoModel} = require('../models/todos');
const {UserModel} = require('../models/users');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("<h1>Welcome To My Experimental Site !!!</h1>" +
    "<p>For CRUD Operations use /todos route...</p>");
})

app.get('/todos', (req, res) =>{
    TodoModel.find().then((todos) => {
        res.send({todos});
    })
})

var port = process.env.PORT || 8000;

app.get('/todos/:id', (req, res) => {
    
    var id = req.params.id;
    
    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    TodoModel.findById(id).then((todo)=> {
        if(!todo){
           return res.status(400).send();
        }
        res.send({todo});
    }).catch((e)=> {
        res.status(400).send();
    })
})

app.post('/todos', (req,res) => {
    
    console.log(req.body)

    var todo = new TodoModel({
        text : req.body.text
    });

    todo.save().then((doc)=> {
        res.send(doc);
    }, (error) => {
        res.status(400).send(error);
    });
})

app.post('/users', (req, res) => {
    
    console.log(req.body);

    var user = new UserModel({
        email : req.body.email
    })

    user.save().then((doc) => {
        res.send(doc);
        
    }, (error) => {
        res.status(400).send(error);
    });
})

// mongoose içerisinde built-in bir promise olmadığında  başka bir frameworkten ya da 
// global üzerinden Promise ını sağlıyor... Promise olmasada .then methodunun olduğunu da dokümanlarda 
// ifade ediyor... 
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true })


// model içerisinde property ismini değiştirirsek öncekiler aynı isimde kalıyor. Sonrakiler değişik olarak kaydediliyor.
// var User = mongoose.model('User', {
//     email : {
//         type : String,
//         required : true,
//         trim : true,
//         minlength : 1
//     }
// })

app.listen(port, () => {
    console.log(`server is up and running on port ${port}`)
})

module.exports = {app}


// var user = new User({
//     email : 'oguzhanun@hotmail.com'
// })

// user.save().then((doc) => {
//     console.log(doc)
// })

// var Todo = mongoose.model('Todo', {
//     text : {
//         type : String,
//         required : true,
//         minlength : 1,
//         trim : true
//     },
//     completed : {
//         type : Boolean,
//         default : false
//     },
//     completedAt : {
//         type : Number,
//         default : null
//     }
// })

// //var todo = new Todo({text : 'Cook Dinner'})

// var todo = new Todo({
//     text : 'Walk the dog'
// })

// todo.save().then((doc) => {
//     console.log(doc)
// }, (error) => {
//     console.log(error)
// })

