// models/Fee.js
class Fee {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_FEETABLE || 'FEE';
    }

    async getAll() {
        const [results] = await this.pool.query(`
            SELECT f.*, s.first_name, s.last_name, o.organization_name 
            FROM ${this.table} f 
            LEFT JOIN STUDENT s ON f.student_number = s.student_number 
            LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id
        `);
        return results;
    }

    async getByStudent(student_number) {
        const [results] = await this.pool.query(
            `SELECT f.*, o.organization_name 
             FROM ${this.table} f 
             LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
             WHERE f.student_number = ?`,
            [student_number]
        );
        return results;
    }

    async getByOrganization(organization_id) {
        const [results] = await this.pool.query(
            `SELECT f.*, s.first_name, s.last_name 
             FROM ${this.table} f 
             LEFT JOIN STUDENT s ON f.student_number = s.student_number 
             WHERE f.organization_id = ?`,
            [organization_id]
        );
        return results;
    }

    async getUnpaidFees() {
        const [results] = await this.pool.query(
            `SELECT f.*, s.first_name, s.last_name, o.organization_name 
             FROM ${this.table} f 
             LEFT JOIN STUDENT s ON f.student_number = s.student_number 
             LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
             WHERE f.status = 'Unpaid'`
        );
        return results;
    }

    async exists(fee_id) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE fee_id = ?`,
            [fee_id]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { fee_id, label, status, amount, date_issue, due_date, organization_id, student_number } = data;
        await this.pool.query(
            `INSERT INTO ${this.table} (fee_id, label, status, amount, date_issue, due_date, organization_id, student_number) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fee_id, label, status || 'Unpaid', amount, date_issue, due_date, organization_id, student_number]
        );
    }

    async update(fee_id, data) {
        const { label, status, amount, date_issue, due_date, organization_id, student_number } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET label = ?, status = ?, amount = ?, date_issue = ?, due_date = ?, 
             organization_id = ?, student_number = ? WHERE fee_id = ?`,
            [label, status, amount, date_issue, due_date, organization_id, student_number, fee_id]
        );
    }

    async updateStatus(fee_id, status) {
        await this.pool.query(
            `UPDATE ${this.table} SET status = ? WHERE fee_id = ?`,
            [status, fee_id]
        );
    }

    async delete(fee_id) {
        await this.pool.query(`DELETE FROM ${this.table} WHERE fee_id = ?`, [fee_id]);
    }

    // NEW REPORT METHODS - Add these to your Fee.js model

    async getUnpaidFeesByOrganizationAndSemester(organization_id, year, semester) {
        const [results] = await this.pool.query(`
            SELECT f.*, s.first_name, s.last_name, o.organization_name 
            FROM ${this.table} f 
            LEFT JOIN STUDENT s ON f.student_number = s.student_number 
            LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
            WHERE f.status = 'Unpaid' 
              AND f.organization_id = ? 
              AND YEAR(f.date_issue) = ? 
              AND CASE 
                WHEN ? = 'First' THEN MONTH(f.date_issue) BETWEEN 1 AND 6
                WHEN ? = 'Second' THEN MONTH(f.date_issue) BETWEEN 7 AND 12
                ELSE 1=1
              END
        `, [organization_id, year, semester, semester]);
        return results;
    }

    async getUnpaidFeesByStudent(student_number) {
        const [results] = await this.pool.query(`
            SELECT f.*, o.organization_name 
            FROM ${this.table} f 
            LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
            WHERE f.status = 'Unpaid' AND f.student_number = ?
        `, [student_number]);
        return results;
    }

    // Updated method for Fee.js - Option A implementation
    async getLateFeesByOrganizationAndYear(organization_id, year) {
        const [results] = await this.pool.query(`
            SELECT f.*, s.first_name, s.last_name, o.organization_name,
                DATEDIFF(CURDATE(), f.due_date) AS days_overdue
            FROM ${this.table} f 
            LEFT JOIN STUDENT s ON f.student_number = s.student_number 
            LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
            WHERE f.status = 'Late' 
            AND f.organization_id = ? 
            AND YEAR(f.date_issue) = ?
            ORDER BY f.due_date DESC
        `, [organization_id, year]);
        return results;
    }

    // BONUS: Add this helper method to automatically update unpaid fees to late status
    async updateOverdueFees() {
        await this.pool.query(`
            UPDATE ${this.table} 
            SET status = 'Late' 
            WHERE status = 'Unpaid' 
            AND due_date < CURDATE()
        `);
    }

    // BONUS: Add method to get all overdue fees that should be marked as late
    async getOverdueUnpaidFees() {
        const [results] = await this.pool.query(`
            SELECT f.*, s.first_name, s.last_name, o.organization_name,
                DATEDIFF(CURDATE(), f.due_date) AS days_overdue
            FROM ${this.table} f 
            LEFT JOIN STUDENT s ON f.student_number = s.student_number 
            LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
            WHERE f.status = 'Unpaid' 
            AND f.due_date < CURDATE()
            ORDER BY days_overdue DESC
        `);
        return results;
    }

    async getTotalFeesByOrganization(organization_id, as_of_date = null) {
        let query = `
            SELECT 
                COUNT(*) as total_fees,
                SUM(f.amount) as total_amount,
                SUM(CASE WHEN f.status = 'Paid' THEN f.amount ELSE 0 END) as paid_amount,
                SUM(CASE WHEN f.status = 'Unpaid' THEN f.amount ELSE 0 END) as unpaid_amount,
                COUNT(CASE WHEN f.status = 'Paid' THEN 1 END) as paid_count,
                COUNT(CASE WHEN f.status = 'Unpaid' THEN 1 END) as unpaid_count
            FROM ${this.table} f 
            WHERE f.organization_id = ?
        `;
        
        const params = [organization_id];
        
        if (as_of_date) {
            query += ' AND f.date_issue <= ?';
            params.push(as_of_date);
        }
        
        const [results] = await this.pool.query(query, params);
        return results[0];
    }

    async getHighestDebtorsBySemester(year, semester, limit = 1) {
        const [results] = await this.pool.query(`
            SELECT 
                f.student_number,
                s.first_name,
                s.last_name,
                SUM(f.amount) as total_debt,
                COUNT(f.fee_id) as fee_count
            FROM ${this.table} f 
            LEFT JOIN STUDENT s ON f.student_number = s.student_number 
            WHERE f.status = 'Unpaid' 
              AND YEAR(f.date_issue) = ?
              AND CASE 
                WHEN ? = 'First' THEN MONTH(f.date_issue) BETWEEN 1 AND 6
                WHEN ? = 'Second' THEN MONTH(f.date_issue) BETWEEN 7 AND 12
                ELSE 1=1
              END
            GROUP BY f.student_number, s.first_name, s.last_name
            ORDER BY total_debt DESC
            LIMIT ?
        `, [year, semester, semester, parseInt(limit)]);
        return results;
    }
}

export default Fee;