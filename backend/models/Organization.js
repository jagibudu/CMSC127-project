// models/Organization.js
class Organization {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_ORGANIZATIONTABLE;
    }

    async getAll() {
        const [results] = await this.pool.query(`SELECT * FROM ${this.table}`);
        return results;
    }

    async exists(organization_id) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE organization_id = ?`,
            [organization_id]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { organization_id, organization_name } = data;
        await this.pool.query(
            `INSERT INTO ${this.table} (organization_id, organization_name) VALUES (?, ?)`,
            [organization_id, organization_name]
        );
    }

    async update(organization_id, data) {
        const { organization_name } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET organization_name = ? WHERE organization_id = ?`,
            [organization_name, organization_id]
        );
    }

    async delete(organization_id) {
        await this.pool.query(`DELETE FROM ${this.table} WHERE organization_id = ?`, [organization_id]);
    }
}

export default Organization;