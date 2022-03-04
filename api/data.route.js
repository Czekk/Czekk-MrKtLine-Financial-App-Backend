import express from 'express';
import DataController from './data.controller.js';

//get access to express router
const router = express.Router();
router.route('/').get(DataController.apiGetData)

export default router;