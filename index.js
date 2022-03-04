import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import DataDAO from './dao/dataDAO.js';
import UserDAO from './dao/userDAO.js';


async function main(){
    dotenv.config();

    const client= new mongodb.MongoClient(
        process.env.MRKTLINE_DB_URI, {useNewUrlParser: true, useUnifiedTopology: true}
    );

    const port = process.env.PORT || 8000;

    try {
        //connect to the MongoDb Cluster
        await client.connect();
        await DataDAO.injectDB(client);
        await UserDAO.injectDB(client);

        app.listen(port, ()=>{
            console.log('server running on port: ' + port);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error)