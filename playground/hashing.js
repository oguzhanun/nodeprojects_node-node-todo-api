const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id : 4
};

// sign ile data yı kodluyoruz. verify ile kodu açıyoruz. ikinci parametre ile kodu saltluyoruz...
var token = jwt.sign(data,'123abc');
console.log(token);


var decoded = jwt.verify(token, '123abc');
console.log(decoded);

// token = {
//     data,
//     hash : SHA256(JSON.stringify(data) + 'SOME_SECRET').toString()
// }

// console.log('data', JSON.stringify(data));
// console.log('token', token.hash);

