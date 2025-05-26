// index.js
import ConnectDB from './db/ConnectDB.js';
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

// Import routes
import StudentRoutes from './routes/StudentRoute.js';
import OrganizationRoutes from './routes/OrganizationRoute.js';
import OrganizationCommitteeRoutes from './routes/OrganizationCommitteeRoute.js';
import OrganizationEventRoutes from './routes/OrganizationEventRoute.js';
import MembershipRoutes from './routes/MembershipRoute.js';
import FeeRoutes from './routes/FeeRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || '3000';

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let pool;

// Initialize database connection and start server
ConnectDB().then(dbPool => {
    pool = dbPool;
    
    // Middleware to attach pool to requests
    app.use((req, res, next) => {
        req.pool = pool;
        next();
    });

    // Default route
    app.get('/', async (req, res) => {
        try {
            res.send("SQL Database API Server - Student Organization Management System");
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // Routes
    app.use("/students", StudentRoutes);
    app.use("/organization", OrganizationRoutes);
    app.use("/organization-committee", OrganizationCommitteeRoutes);
    app.use("/organization-event", OrganizationEventRoutes);
    app.use("/membership", MembershipRoutes);
    app.use("/fee", FeeRoutes);
    
    // Error handling middleware
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });

    // Handle 404 routes
    app.use((req, res) => {
        res.status(404).json({ error: 'Route not found' });
    });
    
    // Start server
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log('Database connected successfully');
    });
}).catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
});