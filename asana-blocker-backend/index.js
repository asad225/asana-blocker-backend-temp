import './src/config/config.js'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import user from './src/api-routes/user-route.js'
import setting from './src/api-routes/setting-route.js'
import rewards from './src/api-routes/reward.route.js'

// import rewards from './src/api-routes/reward.route.js'
const app = express();
dotenv.config();





app.use(cors({
    origin: true,
    credentials: true,
    defaultErrorHandler: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
// app.use("/public",express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())

app.use('/api/v1', user, setting,rewards)

app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist please put Api prod routes ..'
    })
});
const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});