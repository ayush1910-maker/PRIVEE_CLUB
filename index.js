import express from 'express';
import cors from 'cors';
import database from './src/db/db.js';
import fs from 'fs';
import config from './src/db/envConfig.js';
import path from 'path';
import {createServer} from 'http';
import { swaggerUi, swaggerSpec } from "./src/utils/swagger.js";


import "./src/utils/associations.js";
import "./src/utils/cron-jobs/forcedlogout.js"


import userRouter from './src/routes/user.route.js'
import editProfile from './src/routes/editProfile.route.js'
import lookingFor from './src/routes/lookingFor.route.js';
import userDetails from './src/routes/userDetails.route.js'
import adminRouter from './src/routes/admin.route.js'
import messageRouter from './src/routes/messages.route.js'


import passport from './src/utils/Passport.js';
import authRoutes from './src/routes/googleAuth.route.js'

const app = express();

const server = createServer(app);

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({message: "Hello from the server"});
})

// routes
app.use("/uploads", express.static(path.join(process.cwd(), "public/temp")));


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/v1/users", userRouter)
app.use("/api/v1/editProfile" , editProfile)
app.use("/api/v1/lookingFor" , lookingFor)
app.use("/api/v1/userDetails" , userDetails)
app.use("/api/v1/admin" , adminRouter)
app.use("/api/v1/messages" , messageRouter)

app.use(passport.initialize())
app.use("/api/v1/auth" , authRoutes)


// database connectivity
database;
console.log(`Database connected to url ${database.url}`)

// server
server.listen(config.PORT, config.HOST, () =>{
    console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
})