import express from 'express'
import cors from 'cors'
import data from './api/data.route.js'
import jwt from './helpers/jwt.js';
import user from './api/user.route.js'
import errorHandler from './helpers/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
//use JWT auth to secure the api
app.use(jwt());

app.use('/api/v1/data', data);
app.use('/user', user);
// app.use('*', (req, res) => {
//     res.status(404).json({error: 'not found'})
// })
app.use(errorHandler);



export default app;