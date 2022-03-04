import expressJwt from 'express-jwt';
import UsersDAO from '../dao/userDAO.js';

function jwt(){
    const secret= 'somesecretpassage';
    return expressJwt({secret: secret, algorithms: ['HS256'], isRevoked}).unless({
        path: [
            '/user/authenticate',
            '/user/register',
            '/user'
            // '/api/v1/data'
        ]
    })
}

async function isRevoked(req, payload, done){
    // const user = await UsersDAO.getUser(req.body.username);
    const user = await UsersDAO.getByID(req.body._id);

    //revoke token if user no longer exists
    if(!user){
        return done(null, true);
    }
    done();
}

export default jwt;