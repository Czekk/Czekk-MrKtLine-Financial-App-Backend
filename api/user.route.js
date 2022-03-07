import express from "express";
import UserController from "./user.controller.js";

const router= express.Router();
router.route('/').post(UserController.apiGetUser);
router.route('/authenticate').post(UserController.apiAuthenticate);
router.route('/register').post(UserController.apiCreateUser);
router.route('/:id').put(UserController.apiUpdateUser);
router.route('/:id').get(UserController.apiGetUserById)
router.route('/:id').delete(UserController.apiDeleteUser)

export default router;