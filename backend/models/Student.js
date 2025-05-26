// models/Student.js
class Student {
    constructor(pool) {
        this.pool = pool;
        this.table = process.env.DB_STUDENTTABLE;
    }

    async getAll() {
        const [results] = await this.pool.query(`SELECT * FROM ${this.table}`);
        return results;
    }

    async exists(student_number) {
        const [results] = await this.pool.query(
            `SELECT COUNT(*) AS count FROM ${this.table} WHERE student_number = ?`,
            [student_number]
        );
        return results[0].count > 0;
    }

    async create(data) {
        const { student_number, first_name, middle_initial, last_name, gender, degree_program } = data;
        await this.pool.query(
            `INSERT INTO ${this.table} (student_number, first_name, middle_initial, last_name, gender, degree_program) VALUES (?, ?, ?, ?, ?, ?)`,
            [student_number, first_name, middle_initial, last_name, gender, degree_program]
        );
    }

    async update(student_number, data) {
        const { first_name, middle_initial, last_name, gender, degree_program } = data;
        await this.pool.query(
            `UPDATE ${this.table} SET first_name = ?, middle_initial = ?, last_name = ?, gender = ?, degree_program = ? WHERE student_number = ?`,
            [first_name, middle_initial, last_name, gender, degree_program, student_number]
        );
    }

    async delete(student_number) {
        await this.pool.query(`DELETE FROM ${this.table} WHERE student_number = ?`, [student_number]);
    }
}

export default Student;