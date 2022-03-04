import { query } from "express";

let data

export default class DataDAO {
    static async injectDB(conn){
        if(data) {
            return
        }

        try {
            data= await conn.db(process.env.MRKTLINE_NS)
            .collection('data')
        }
        catch(e){
            console.error(`unable to connect in DataDAO:${e}`)
        }
    }

    //retrieving data
    static async getData({
        filters= null
    }={}){
        let query
       
                query = {"period": {$eq: filters["period"]}}
             
        
        let selector
        try {
            selector= await data
            .findOne(query)
            const dataObj = selector;
            return selector
        }
        catch(e) {
            console.error(`Unable to issue findOne command ${e}`);
        }
    }
}