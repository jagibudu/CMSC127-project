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

    // NEW REPORT METHODS
    async getMembersByFilters(filters) {
        let query = `
            SELECT  
                s.student_number, 
                CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                s.gender, 
                s.degree_program, 
                YEAR(bt.membership_date) AS batch, 
                o.organization_name, 
                oc.committee_name, 
                bt.role, 
                bt.status, 
                bt.remaining_balance 
            FROM  
                STUDENT s 
            JOIN  
                ${this.viewTable} bt ON s.student_number = bt.student_number 
            JOIN  
                ORGANIZATION o ON bt.organization_id = o.organization_id 
            LEFT JOIN  
                ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id 
            WHERE 1 = 1
        `;
        
        const params = [];
        
        if (filters.role) {
            query += ' AND bt.role = ?';
            params.push(filters.role);
        }
        
        if (filters.status) {
            query += ' AND bt.status = ?';
            params.push(filters.status);
        }
        
        if (filters.gender) {
            query += ' AND s.gender = ?';
            params.push(filters.gender);
        }
        
        if (filters.degree_program) {
            query += ' AND s.degree_program = ?';
            params.push(filters.degree_program);
        }
        
        if (filters.batch) {
            query += ' AND YEAR(bt.membership_date) = ?';
            params.push(filters.batch);
        }
        
        if (filters.committee_name) {
            query += ' AND oc.committee_name = ?';
            params.push(filters.committee_name);
        }
        
        if (filters.organization_id) {
            query += ' AND bt.organization_id = ?';
            params.push(filters.organization_id);
        }
        
        query += ' ORDER BY o.organization_name, bt.role, s.last_name, s.first_name';
        
        const [results] = await this.pool.query(query, params);
        return results;
    }

    async getExecutiveCommitteeMembers(organization_id, year) {
        const [results] = await this.pool.query(`
            SELECT  
                s.student_number, 
                CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                s.gender, 
                s.degree_program, 
                o.organization_name, 
                oc.committee_name, 
                bt.role, 
                bt.membership_date, 
                bt.status 
            FROM  
                ${this.table} bt 
            JOIN  
                STUDENT s ON bt.student_number = s.student_number 
            JOIN  
                ORGANIZATION o ON bt.organization_id = o.organization_id 
            JOIN  
                ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id 
            WHERE  
                oc.committee_name = 'Executive Committee' 
                AND bt.organization_id = ?
                AND YEAR(bt.membership_date) = ?
            ORDER BY  
                s.last_name, s.first_name
        `, [organization_id, year]);
        return results;
    }

    async getMembersByRole(role) {
        const [results] = await this.pool.query(`
            SELECT  
                s.student_number, 
                CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                s.gender, 
                s.degree_program, 
                o.organization_name, 
                bt.role, 
                YEAR(bt.membership_date) AS year_joined, 
                bt.status 
            FROM  
                ${this.table} bt 
            JOIN  
                STUDENT s ON bt.student_number = s.student_number 
            JOIN  
                ORGANIZATION o ON bt.organization_id = o.organization_id 
            WHERE  
                bt.role = ?
            ORDER BY  
                YEAR(bt.membership_date) DESC, 
                s.last_name, 
                s.first_name
        `, [role]);
        return results;
    }

    async getMembershipStatusPercentage(organization_id, years_back) {
        const current_year = new Date().getFullYear();
        const start_year = current_year - years_back;
        
        const [results] = await this.pool.query(`
            SELECT  
                status, 
                COUNT(*) AS count, 
                ROUND(100 * COUNT(*) / ( 
                    SELECT COUNT(*)  
                    FROM ${this.table}
                    WHERE YEAR(membership_date) >= ?
                      AND organization_id = ? 
                ), 2) AS percentage 
            FROM ${this.table}
            WHERE YEAR(membership_date) >= ?
              AND organization_id = ? 
            GROUP BY status
        `, [start_year, organization_id, start_year, organization_id]);
        return results;
    }

    async getAlumniMembers(organization_id, as_of_date = null) {
        let query = `
            SELECT  
                s.student_number, 
                CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                s.gender, 
                s.degree_program, 
                bt.membership_date, 
                o.organization_name 
            FROM  
                ${this.table} bt 
            JOIN  
                STUDENT s ON bt.student_number = s.student_number 
            JOIN  
                ORGANIZATION o ON bt.organization_id = o.organization_id 
            WHERE  
                bt.status = 'Alumni' 
                AND bt.organization_id = ?
        `;
        
        const params = [organization_id];
        
        if (as_of_date) {
            query += ' AND bt.membership_date <= ?';
            params.push(as_of_date);
        }
        
        query += ' ORDER BY s.last_name, s.first_name';
        
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