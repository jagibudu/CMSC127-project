import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const ConnectDB = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test the connection
        const connection = await pool.getConnection();
        console.log('Database connected successfully');
        connection.release();
        
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
};

export default ConnectDB;