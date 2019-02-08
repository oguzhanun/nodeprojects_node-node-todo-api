const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var data = {
    id : 4
};

// sign ile data yı kodluyoruz. verify ile kodu açıyoruz. ikinci parametre ile kodu saltluyoruz...
var token = jwt.sign(data,'123abc');
console.log('token : ',token);


var decoded = jwt.verify(token, '123abc');
console.log('decoded : ',decoded);

// token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + 'SOME_SECRET').toString()
// }

// console.log('data', JSON.stringify(data));
// console.log('token', token.hash);


var password = '123abc';
bcrypt.genSalt(3, (err,salt)=>{
    bcrypt.hash(password,salt,(err,hash)=>{
        if(err){
            console.log('[error] :',err)
        }
        console.log('[hash] :',hash);
        console.log('[comparing result] :');
        bcrypt.compare(password,hash,(err,success)=>{
            if(!err){
                console.log('[success]:',success);
            }
        });
    })
})
