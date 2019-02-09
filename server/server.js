require('../config/config.js');

const {authenticate} = require('../middleware/authenticate.js');
const {TodoModel} = require('../models/todos');
const {UserModel} = require('../models/users');
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("<h1>Welcome To My Experimental Site !!!</h1>" +
    "<p>For CRUD Operations use /todos route...</p>");
})

app.get('/todos', (req, res) =>{
    TodoModel.find().then((todos) => {
        res.send({todos});
    });
})

app.delete('/todos/:id', (req,res)=>{
    
    var id = req.params.id;
    console.log(id);
    
    if(ObjectID.isValid('id')){
        return res.status(404).send()
    }
    TodoModel.findByIdAndDelete(id).then((doc)=>{
        if(!doc){
            return res.status(404).send();
        }
        return res.status(200).send({doc});
    }, (err)=>{
        res.status(400).send();
    })
})

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

app.get('/users/me', authenticate, (req,res)=>{
    res.send(req.user);
})

app.post('/todos', (req,res) => {
    
    console.log('request body : ',req.body)

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
    var body = _.pick(req.body, ['email','password']);
    var user = new UserModel(body);

    user.save().then((user) => {

        return user.generateAuthToken();

    }, (error) => {

        res.status(400).send(error);

    }).then((token)=>{

        res.header('x-auth', token).send(user);
    }).catch((err)=>{
        res.status(400).send();
    });
})

app.patch('/todos/:id', (req, res)=>{
    var id = req.params.id;
    var body = _.pick( req.body, ['text', 'completed'] );
    
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }
    TodoModel.findByIdAndUpdate(id, {$set:body},{new:true}).then(todo=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch(e=>{
        res.status(400).send();
    })
})

app.post('/users/login', (req, res)=>{
    var credentials = _.pick(req.body, ['email','password']);
    UserModel.findOne({email : credentials.email}).then((user)=>{
        console.log('email bulundu.')
        if(user){
            bcrypt.compare(credentials.password,user.password,).then((result)=>{
                if(result){
                    console.log('token:',user.tokens[0].token)
                    res.header('x-auth',user.tokens[0].token).send(user);
                }
            }).catch((err)=>{
                console.log(err);
            });
        }
    }).catch((err)=>{
        console.log(err);
    })
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

