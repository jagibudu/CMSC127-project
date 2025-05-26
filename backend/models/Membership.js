// models/Membership.js
class Membership {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_BELONGSTOTABLE || 'BELONGS_TO';
        this.viewTable = 'BELONGS_TO_WITH_BALANCE';
    }

    async getAll() {
        const [results] = await this.pool.query(`
            SELECT bt.*, s.first_name, s.last_name, o.organization_name, oc.committee_name
            FROM ${this.table} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION o ON bt.organization_id = o.organization_id
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
        `);
        return results;
    }

    async getAllWithBalance() {
        const [results] = await this.pool.query(`SELECT * FROM ${this.viewTable}`);
        return results;
    }

    async getByStudent(student_number) {
        const [results] = await this.pool.query(`
            SELECT bt.*, o.organization_name, oc.committee_name
            FROM ${this.table} bt
            LEFT JOIN ORGANIZATION o ON bt.organization_id = o.organization_id
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
            WHERE bt.student_number = ?
        `, [student_number]);
        return results;
    }

    async getByOrganization(organization_id) {
        const [results] = await this.pool.query(`
            SELECT bt.*, s.first_name, s.last_name, oc.committee_name
            FROM ${this.table} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
            WHERE bt.organization_id = ?
        `, [organization_id]);
        return results;
    }

    async getActiveMembers(organization_id = null) {
        let query = `
            SELECT bt.*, s.first_name, s.last_name, o.organization_name, oc.committee_name
            FROM ${this.table} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION o ON bt.organization_id = o.organization_id
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
            WHERE bt.status = 'Active'
        `;
        const params = [];
        
        if (organization_id) {
            query += ' AND bt.organization_id = ?';
            params.push(organization_id);
        }
        
        const [results] = await this.pool.query(query, params);
        return results;
    }

    async exists(student_number, organization_id) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE student_number = ? AND organization_id = ?`,
            [student_number, organization_id]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { student_number, organization_id, committee_id, membership_date, status, role } = data;
        await this.pool.query(
            `INSERT INTO ${this.table} (student_number, organization_id, committee_id, membership_date, status, role) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [student_number, organization_id, committee_id, membership_date, status || 'Active', role || 'Member']
        );
    }

    async update(student_number, organization_id, data) {
        const { committee_id, membership_date, status, role } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET committee_id = ?, membership_date = ?, status = ?, role = ? 
             WHERE student_number = ? AND organization_id = ?`,
            [committee_id, membership_date, status, role, student_number, organization_id]
        );
    }

    async updateStatus(student_number, organization_id, status) {
        await this.pool.query(
            `UPDATE ${this.table} SET status = ? WHERE student_number = ? AND organization_id = ?`,
            [status, student_number, organization_id]
        );
    }

    async delete(student_number, organization_id) {
        await this.pool.query(
            `DELETE FROM ${this.table} WHERE student_number = ? AND organization_id = ?`,
            [student_number, organization_id]
        );
    }
}

export default Membership;