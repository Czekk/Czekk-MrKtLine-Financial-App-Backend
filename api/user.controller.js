import UsersDAO from "../dao/userDAO.js";

export default class UserController{
    static async apiAuthenticate(req, res, next) {
        UsersDAO.authenticate(req.body)
        .then(user => user? res.json(user): res.status(400).json({message: 'Username or password is incorrect!'}))
        .catch(err => next(err));
    }

    static async apiCreateUser(req, res, next) {
        UsersDAO.create(req.body)
        .then(created=> created? res.json(created): res.status(400).json({message: 'Error!'}))
        .catch(err=> next(err))
        console.log(res.body)
    }

    static async apiGetUser(req,res,next){
        UsersDAO.getUser(req.body.username)
        .then(users => users? res.json(users): res.status(400).json({message: 'Something went wrong!'}))
        .catch(err=> next(err))
    }

    static async apiGetUserById(req, res, next){
        UsersDAO.getByID(req.body.id)
        .then(user=> user? res.json(user): res.status(400).json({message: 'User does not exist!'}))
        .catch(err=> next(err))
    }

    static async apiUpdateUser(req, res, next) {
        UsersDAO.update(req.body.id, req.body)
        .then(update => update? res.json(update): res.status(400).json({message: 'Update failed!!'}))
        .catch(err=> next(err))
    }

    static async apiDeleteUser(req, res, next) {

        try{
            const response= await UsersDAO.delete(req.body.id);
            res.json({status: "success"})
        }
        catch(e){
            res.status(500).json({error: e.message})
        }
        // UsersDAO.delete(req.body.id)
        // .then(deleted => deleted? res.json(deleted): res.status(400).json({message: 'Deletion failed!'}))
        // .catch(err => next(err))
    }
}
