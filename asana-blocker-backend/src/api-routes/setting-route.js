import express from "express";
const routes = express.Router();


import { 
    getMethod ,postMethod, getgetMethodById,updateMethod,deleteMethod,

    getText ,postText, getTextById,updateText,deleteText, 
    
    postCheckInterval , getCheckInterval, getCheckIntervalById,updateCheckInterval,deleteCheckInterval
} from '../api/setting.js';


routes.post('/method', postMethod)
routes.get('/method',getMethod)
routes.get('/method/:_id',getgetMethodById)
routes.put('/method/:_id', updateMethod)
routes.delete('/method/:_id', deleteMethod)




routes.post('/text', postText)
routes.get('/text',getText)
routes.get('/text/:_id',getTextById)
routes.put('/text/:_id', updateText)
routes.delete('/text/:_id', deleteText)


routes.post('/CheckInterval', postCheckInterval)
routes.get('/CheckInterval',getCheckInterval)
routes.get('/CheckInterval/:_id',getCheckIntervalById)
routes.put('/CheckInterval/:_id', updateCheckInterval)
routes.delete('/CheckInterval/:_id', deleteCheckInterval)

export default routes