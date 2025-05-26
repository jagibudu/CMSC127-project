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

// Import controller functions to initialize models
import { initializeModel as initializeStudentModel } from './controllers/student_controller.js';
import { initializeModel as initializeOrganizationModel } from './controllers/organization_controller.js';
import { initializeModel as initializeOrganizationCommitteeModel } from './controllers/organization_committee_controller.js';

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
    
    // Initialize models in controllers
    initializeStudentModel(pool);
    initializeOrganizationModel(pool);
    initializeOrganizationCommitteeModel(pool);
    
    // Middleware to attach pool to requests (for backward compatibility if needed)
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
        console.log('Database connected and models initialized successfully');
    });
}).catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
});