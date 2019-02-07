const {UserModel} = require('../models/users');


var authenticate = (req, res, next) =>{
    
    var token = req.header('x-auth');

    UserModel.findByToken(token).then((user)=>{
    
        if(!user){
            // catch e düşer...
            return Promise.reject('no user could be found')
        }

        req.user = user;
        req.token = token;
        next();
    
    }).catch((e)=>{
        res.status(401).send(e);
    });
}

module.exports = {authenticate};