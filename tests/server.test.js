const expect = require('expect')
const supertest = require('supertest')
const {app} = require('../server/server.js')
const {TodoModel} = require('../models/todos') 

beforeEach((done)=>{
    // remove deprecate olmuş onun yerine deleteOne veya deleteMany kullanmak gerekiyor...
    TodoModel.remove().then(() => {
        done()
    })
})

describe('/todos test :', () => {

    it('should test posting todos', (done) => {
        
        var text = "This is for testing purposes"

        supertest(app)
            .post('/todos')
            .send({text : text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            }).end((err, res) => {
                if(err){
                    return done(err)
                }
                TodoModel.find().then((todos) => {
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
                expect(todos.length).toBe(0);
                done();
            }).catch((e)=> {
                done(e);
            })
        })
    })
})