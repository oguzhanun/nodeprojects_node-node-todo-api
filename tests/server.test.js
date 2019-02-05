const expect = require('expect')
const supertest = require('supertest')
const {app} = require('../server/server.js')
const {TodoModel} = require('../models/todos') 
const {ObjectID} = require('mongodb');


const todos = [{
    _id : new ObjectID(),
    text : "the first one for test"
}
// , {
//     _id : new ObjectID(),
//     text : "the second one for test"
// }
];

beforeEach((done)=>{
    // remove deprecate olmuş onun yerine deleteOne veya deleteMany kullanmak gerekiyor...
    TodoModel.remove().then(() => {
        return TodoModel.insertMany(todos)
    }).then(()=>{
        done();
    })
})

describe('/todos test :', () => {

    it('should test posting todos', (done) => {
        
        var text = "This is for testing purposes"

        supertest(app)
            .post('/todos')
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
        supertest(app).post('/todos').send({}).expect(400).end((err, res) => {
            if(err){
                return done(err);
            }
            TodoModel.find().then((todos) => {
                expect(todos.length).toBe(1);
                done();
            }).catch((e)=> {
                done(e);
            })
        })
    })
})

describe('GET /todos', () => {
    it('should test if all todos come', (done) => {
        supertest(app).get('/todos').expect(200).expect((res)=>{
            expect(res.body.todos.length).toBe(1);
        }).end(done);
    })
});

describe('GET /todos/:id', () => {
    it('should return the first todo', (done) =>{
        
        // id değeri 24 byte lık bir hexadecimal değer olduğundan bu şekilde string dönüşümü yapılıyor.
        supertest(app).get(`/todos/${todos[0]._id.toHexString()}`).expect(200)
            .expect((res)=>{
                //console.log(res);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    })

    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app).get(`/todos/5c582c4b34227606f9c1725c`).expect(400).end(done);
    })


    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app).get(`/todos/123`).expect(400).end(done);
    })
});

describe ('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{

        var hexId = todos[0]._id.toHexString();
        
        supertest(app).delete(`/todos/${hexId}`)
            .expect(200).expect((res)=>{
                console.log(res.body);
                expect(res.body.doc._id).toBe(hexId);
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                TodoModel.findById(hexId).then((res)=>{
                    expect(res).toNotExist();
                    return done();
                }, (err)=>{
                    done(err);
                })
            })
    })

    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app).delete(`/todos/5c582c4b34227606f9c1725c`).expect(404).end(done);
    })


    it('should test if it fails when given a non-existing ID', (done) => {
        supertest(app).delete(`/todos/123`).expect(400).end(done);
    })
})