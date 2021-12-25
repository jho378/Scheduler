const crypto = require('crypto');
const User = require('./models/User');
const Key = require('./models/Key');
const jwt = require('jsonwebtoken');
const encryptPassword = (password) => {
    return crypto.createHash('sha512').update(password).digest('base64');
}

const setAuth = async(req, res, next) => {
    const authorization = req.headers.authorization;
    // front : const key = jwt.sign({publicKey : pub}, sec {expiresIn : 3600});
    const [bearer, key] = authorization.split(' ');
    if(bearer!=='Bearer') return res.status(400).send({error : 'Wrong Authorization'});
    const decodedJwt = jwt.decode(key);
    if(decodedJwt === null) return res.status(400).send({error : 'Invalied Key'});
    const _pub = decodedJwt.publicKey;
    const _key = await Key.findOne({publicKey : _pub});
    let user = null;
    try{
        console.log('verifying');
        const verified = jwt.verify(key, _key.secretKey);
        // user = await User.findById(_key.user);
        user = _key.user;
    }   catch(e){
        return res.status(403).send({error: 'Invalid token'});
    }
    if(!user) return res.status(404).send({error : 'Cannot find user'});
    req.user = user;
    return next();
}


module.exports = {
    encryptPassword,
    setAuth, 
}