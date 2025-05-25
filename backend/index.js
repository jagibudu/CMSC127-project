import ConnectDB from './db/ConnectDB.js';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import StudentRoutes from './routes/StudentRoute.js' 
import OrganizationRoutes from './routes/OrganizationRoute.js'
import OrganizationCommitteeRoutes from './routes/OrganizationCommitteeRoute.js'

dotenv.config();

const app = express();
const port = process.env.PORT || '3000';

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

let pool; 

ConnectDB().then(dbPool => {
    pool = dbPool;
    app.use((req, res, next) => {
        req.pool = pool; 
        next(); 
    });

    app.use("/students", StudentRoutes);
    app.use("/organization", OrganizationRoutes) 
    app.use("/organization-committee", OrganizationCommitteeRoutes) 
    app.listen(port, () => console.log(`Listening on ${port}`));
}).catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
});