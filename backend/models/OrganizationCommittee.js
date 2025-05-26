// models/OrganizationCommittee.js
class OrganizationCommittee {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_ORGANIZATIONCOMMITTEETABLE;
    }

    async getAll() {
        const [results] = await this.pool.query(`SELECT * FROM ${this.table}`);
        return results;
    }

    async getByOrganization(organization_id) {
        const [results] = await this.pool.query(
            `SELECT * FROM ${this.table} WHERE organization_id = ?`,
            [organization_id]
        );
        return results;
    }

    async exists(committee_id) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE committee_id = ?`,
            [committee_id]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { organization_id, committee_name } = data;
        const [result] = await this.pool.query(
            `INSERT INTO ${this.table} (organization_id, committee_name) VALUES (?, ?)`,
            [organization_id, committee_name]
        );
        return result.insertId;
    }

    async update(committee_id, data) {
        const { organization_id, committee_name } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET organization_id = ?, committee_name = ? WHERE committee_id = ?`,
            [organization_id, committee_name, committee_id]
        );
    }

    async delete(committee_id) {
        await this.pool.query(`DELETE FROM ${this.table} WHERE committee_id = ?`, [committee_id]);
    }
}

export default OrganizationCommittee;