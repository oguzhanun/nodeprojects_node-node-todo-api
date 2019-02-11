const expect = require('expect');
const supertest = require('supertest');
const {app} = require('../server/server.js');
const {TodoModel} = require('../models/todos.js'); 
const {UserModel} = require('../models/users.js');
const {ObjectID} = require('mongodb');
const {todos,users,populateUsers,populateTodos} = require('./seed/seed.js');

// const todos = [{
//     _id : new ObjectID(),
//     text : "the first one for test"
// }
// , {
//     _id : new ObjectID(),
//     text : "the second one for test"
// }
// ];

// beforeEach((done)=>{
//     // remove deprecate olmuş onun yerine deleteOne veya deleteMany kullanmak gerekiyor...
//     TodoModel.deleteMany({}).then(() => {
//          TodoModel.insertMany(todos)
         
//     }).then(()=>{
//         done();
//     })
// })

beforeEach(populateUsers);

beforeEach(populateTodos);

describe('/todos test :', () => {

    it('should test posting todos', (done) => {
        
        var text = "This is for testing purposes"

        supertest(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            }).end((err, res) => {
                if(err){
                    return done(err)
                }
                TodoModel.find({text}).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done();
                }).catch( (e) => {
                    done(e)
                })
            })
    })

    it('should not create a todo with an invalid data', (done) => {
        supertest(app).post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            TodoModel.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e)=> {
                done(e);
            })
        })
    })
})

describe('GET /todos', () => {
    it('should test if all todos come', (done) => {
        supertest(app)
            .get('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        }).end(done);
    })
});

describe('GET /todos/:id', () => {
    it('should return the first todo', (done) =>{
        
        // id değeri 24 byte lık bir hexadecimal değer olduğundan bu şekilde string dönüşümü yapılıyor.
        supertest(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                //console.log(res);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should not return someone elses todos', (done) =>{
        
        // id değeri 24 byte lık bir hexadecimal değer olduğundan bu şekilde string dönüşümü yapılıyor.
        supertest(app).get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(400)
            .end(done);
    })

    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app)
            .get(`/todos/5c582c4b34227606f9c1725c`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(400)
            .end(done);
    })


    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app)
            .get(`/todos/123`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(400)
            .end(done);
    })
});

describe ('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{

        var hexId = todos[0]._id.toHexString();
        
        supertest(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200).expect((res)=>{
                //console.log(res.body);
                expect(res.body.doc._id).toBe(hexId);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                TodoModel.findById(hexId).then((res)=>{
                    expect(res).toBeFalsy();
                    return done();
                }, (err)=>{
                    done(err);
                })
            })
    })

    it('should not remove a todo', (done)=>{

        var hexId = todos[1]._id.toHexString();
        
        supertest(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                TodoModel.findById(hexId).then((res)=>{
                    expect(res).toBeTruthy();
                    return done();
                }, (err)=>{
                    done(err);
                })
            })
    })

    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app)
            .delete(`/todos/5c582c4b34227606f9c1725c`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })


    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app)
        .delete(`/todos/123`)
        .set('x-auth',users[0].tokens[0].token)
        .expect(400)
        .end(done);
    })
})

describe('PATCH /todos/:id', ()=>{

    it('should update the todo', (done)=>{
        
        var id = todos[0]._id.toHexString();
        var todo = {
            text :'text for test purposes',
            completed : true
        }
        supertest(app)
            .patch(`/todos/${id}`)
            .send(todo)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
            //console.log(res.body);
            expect(res.body.todo.text).toBe('text for test purposes');
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
            
        },(err)=>{
            done(err);
        }).end(done)
    })

    it('should not update the todo', (done)=>{
        
        var id = todos[0]._id.toHexString();
        var todo = {
            text :'text for test purposes',
            completed : true
        }
        supertest(app)
            .patch(`/todos/${id}`)
            .send(todo)
            .set('x-auth',users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })

    it('should clear completedAt when todo is not completed', (done)=>{
        
        var id = todos[1]._id.toHexString();

        supertest(app).patch(`/todos/${id}`).send({text:'this is for a test', completed:false})
            .set('x-auth',users[1].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('this is for a test');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeFalsy();
            },(err)=>{
                done(err);
            }).end(done);
    })
})

describe('GET /users/me :', ()=>{
    
    it('should return user if authenticated', (done) =>{
        supertest(app).get('/users/me').set('x-auth', users[0].tokens[0].token)
            .expect(200).expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) =>{
        supertest(app).get('/users/me')
            .expect(401).expect((res)=>{
                expect(res.body).toEqual({});
                expect(res.body).toEqual({});
            })
            .end(done);
    })

})

describe('POST /users :', ()=>{
    it('should return a valid user with an email and id and a token in the header', (done) => {
        const email = 'jenifer@lopez.com';
        const password = '123kaj' 
        supertest(app).post('/users').send({email, password}).expect(200).expect((res)=>{
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
            expect(res.headers['x-auth']).toBeTruthy();
        }).end((err)=>{
            if(err){
                done(err);
            }
            UserModel.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch(err=>{
                done(err);
            })
        })
    })

    it('should return validation errors', (done) => {
        
        const email = 'jenifer@lopez.com';
        const password = '123ka';

        supertest(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .expect((res)=>{
            //console.log(res.body._message);
            expect(res.body._message).toBe('UserModel validation failed');
        }).end(done)
    })


    it('should not create user', (done) => {
        
        supertest(app).post('/users')
            .send({email:users[0].email, password:users[0].password})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', ()=>{

    it('should login user and return auth token', (done)=>{
        supertest(app).post('/users/login')
            .send({email : users[0].email,
                password : users[0].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                UserModel.findById(users[0]._id).then((user)=>{
                    expect(user.tokens[0]).toMatchObject({    //toInclude() un karşılığı olarak gelen fonksiyon
                        access:'auth',
                        token : res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>{
                    done(e);
                })
            })
    })

    it('should reject invalid login',()=>{
        supertest(app).post('/users/login')
        .send({email : users[1].email,
            password : users[1].password + 1
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toBeFalsy();  // yalnız burası için toNotExist() sorun çıkarmıyor...???????? İLGİNÇ ??????
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
            UserModel.findById(users[1]._id).then((user)=>{
                expect(user.tokens[0].length).toBe(1);
                done();
            }).catch((e)=>{
                done(e);
            })
        })
    })

})

describe('DELETE /users/me/token', ()=>{
    it('should delete token when logging out',(done)=>{
        supertest(app).delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err){
                    done(err);
                }
                UserModel.findById(users[0]._id).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch(e=>done(e));
            })
    })
})
