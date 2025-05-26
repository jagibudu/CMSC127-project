// models/OrganizationEvent.js
class OrganizationEvent {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_ORGANIZATIONEVENTTABLE || 'ORGANIZATION_EVENT';
    }

    async getAll() {
        const [results] = await this.pool.query(`
            SELECT oe.*, o.organization_name 
            FROM ${this.table} oe 
            LEFT JOIN ORGANIZATION o ON oe.organization_id = o.organization_id
        `);
        return results;
    }

    async getByOrganization(organization_id) {
        const [results] = await this.pool.query(
            `SELECT * FROM ${this.table} WHERE organization_id = ?`,
            [organization_id]
        );
        return results;
    }

    async exists(event_id) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE event_id = ?`,
            [event_id]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { organization_id, event_name } = data;
        const [result] = await this.pool.query(
            `INSERT INTO ${this.table} (organization_id, event_name) VALUES (?, ?)`,
            [organization_id, event_name]
        );
        return result.insertId;
    }

    async update(event_id, data) {
        const { organization_id, event_name } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET organization_id = ?, event_name = ? WHERE event_id = ?`,
            [organization_id, event_name, event_id]
        );
    }

    async delete(event_id) {
        await this.pool.query(`DELETE FROM ${this.table} WHERE event_id = ?`, [event_id]);
    }
}