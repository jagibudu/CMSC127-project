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
}

export default Fee;