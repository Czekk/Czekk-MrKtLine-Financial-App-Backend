import { query, response } from "express";
import bcrypt from 'bcryptjs'
import { config } from "dotenv";
import jwt from 'jsonwebtoken'
import { ObjectId } from "mongodb";

let user;

export default class UsersDAO {
    static async injectDB(conn){
        if(user){
            return
        }
        try {
            user= await conn.db(process.env.MRKTLINE_NS)
            .collection('users')
        }
        catch(e){
            console.error(`unable to connect in UsersDAO:${e}`)
        }
    }
    static async authenticate({username, password}) {
       try{ 
            const User = await user.findOne({username: username});
            if(User === null){
                throw 'Invalid User Name!'
            }
            if(!bcrypt.compareSync(password, User.hash)){
                throw 'Wrong password!'
            }
            if(User && bcrypt.compareSync(password, User.hash)){
                const token = jwt.sign({sub: user.id}, process.env.SECRET, {expiresIn: '7d'});
                return {
                    ...User,
                    token
                }
            }
        }
        catch(e){
            console.error(`unable to connect in UsersDAO: ${e}`);
        }
    }

    static async getAll(){
        
        return await user.find({});
      
    }

    static async getUser(username){
        return await user.findOne({username:username})
    }

    static async getByID(id){
        return await user.find({_id:id})
    }

    static async create(userParam) {
        const userFound= await user.findOne({username: userParam.username});
        let hash;
        if (userFound) {
            throw 'Username ' + userParam.username + 'is already taken';
        }
        if (userParam.password){
            hash = bcrypt.hashSync(userParam.password, 10)
        }

        try{
            const newUser={
                firstname: userParam.firstname,
                lastname: userParam.lastname,
                username: userParam.username,
                hash: hash,
                email: userParam.email,
                position: null,
                status: userParam.status,
                address: null,
                phone: null,
                preference: { showQuickPoints: true, defaultPeriod: 'YTD' }
            }
            const res= await user.insertOne(newUser);
            return res
        }
        catch(e){
            console.error(`unable to create user: ${e}`)
            return {error: e}
        }
    }

    static async update(id, userparam) {
        const foundUser= await user.findOne({_id:ObjectId(id)});
        let newUser= {};

        //validate 
        if(!foundUser) throw 'User not found';
        if(foundUser.username !== userparam.username && await user.findOne({ username: userparam.username})) {
            throw 'Username ' + userparam.username + ' is already taken'
        }
        if(userparam.username && foundUser.username !== userparam.username){
            newUser.username= userparam.username;
        }
        else{
            newUser.username= foundUser.username;
        }
        // hash password if it was entered
        if (userparam.password && userparam.password !== foundUser.hash){
            newUser.hash = bcrypt.hashSync(userparam.password, 10);
            
        }
        else{
            newUser.hash= foundUser.hash;
        }

        if (userparam.firstname && userparam.firstname !== foundUser.firstname){
            newUser.firstname= userparam.firstname;
        }
        else{
            newUser.firstname= foundUser.firstname;
        }

        if (userparam.lastname && userparam.lastname !== foundUser.lastname){
            newUser.lastname= userparam.lastname;
        }
        else{
            newUser.lastname= foundUser.lastname;
        }

        if (userparam.email && userparam.email !== foundUser.email){
            newUser.email= userparam.email;
        }
        else{
            newUser.email= foundUser.email;
        }

        if (userparam.position && userparam.position !== foundUser.position){
            newUser.position= userparam.position;
        }
        else{
            newUser.position= foundUser.position;
        }

        if (userparam.status && userparam.status !== foundUser.status){
            newUser.status= userparam.status;
        }
        else{
            newUser.status= foundUser.status; 
        }

        if (userparam.address && userparam.address !== foundUser.address){
            newUser.address = userparam.address;
        }
        else{
            newUser.address = foundUser.address;
        }

        if(userparam.phone && userparam.phone !== foundUser.phone){
            newUser.phone= userparam.phone;
        }
        else{
            newUser.phone= foundUser.phone;
        }
        
        if(userparam.preference){
            newUser.preference= {showQuickPoints:null, defaultPeriod: null}
            if (userparam.preference.showQuickPoints !== foundUser.preference.showQuickPoints){
                newUser.preference.showQuickPoints= userparam.preference.showQuickPoints;
            }
            else{
                newUser.preference.showQuickPoints= foundUser.preference.showQuickPoints;
            }
        
            if (userparam.preference.defaultPeriod !== foundUser.preference.defaultPeriod){
                newUser.preference.defaultPeriod = userparam.preference.defaultPeriod;
            }
            else{
                newUser.preference.defaultPeriod= foundUser.preference.defaultPeriod;
            }
        }

        const query= {_id: ObjectId(id)};
        try{
            const res= await user.updateOne(query, {$set: newUser});
            return res;
        }
        catch(e){
            console.error(`Error updating the user Info in UserDAO ${e}`);
            return {error: e};
        }
        
        // await user.save(userparam)
    }

    static async delete(id){
        await user.deleteOne({"_id": ObjectId(id)});
    }
}