import express from "express";
const routes = express.Router();


import { userSignup, userLogin, updateUser, getUserById, getAllUsers} from '../api/user.js';


routes.post('/userSignup', userSignup)
routes.post('/userLogin', userLogin)
routes.put('/user/:_id', updateUser)
routes.get('/user/:_id',getUserById)
routes.get('/user',getAllUsers)



export default routes