import express from "express";
const router = express.Router();

// get all students
router.get('/', async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_STUDENTTABLE}`);
        res.json(results);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal server error');
    }
});

// insert a new student to the database
router.post("/", async (req, res) => {
    const { student_number, first_name, middle_initial, last_name, gender, degree_program } = req.body;

    if (!student_number || !gender) {
        return res.status(400).send('student_number and gender are required');
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_STUDENTTABLE} WHERE student_number = ?`,
            [student_number]
        );
        if (checkResults[0].count > 0) {
            return res.status(409).send('Student already exists');
        }

        const [insertResults] = await req.pool.query(
            `INSERT INTO ${process.env.DB_STUDENTTABLE} 
            (student_number, first_name, middle_initial, last_name, gender, degree_program) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [student_number, first_name, middle_initial, last_name, gender, degree_program]
        );

        res.status(201).json({ student_number, first_name, middle_initial, last_name, gender, degree_program });
    } catch (error) {
        console.error("Error inserting student: ", error);
        res.status(500).send("Internal server error");
    }
});

// update student
router.put("/", async (req, res) => {
    const { student_number, first_name, middle_initial, last_name, gender, degree_program } = req.body;

    if (!student_number) {
        return res.status(400).send('student_number is required');
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_STUDENTTABLE} WHERE student_number = ?`,
            [student_number]
        );

        if (checkResults[0].count === 0) {
            return res.status(404).send("Student does not exist.");
        }

        await req.pool.query(
            `UPDATE ${process.env.DB_STUDENTTABLE} 
            SET first_name = ?, middle_initial = ?, last_name = ?, gender = ?, degree_program = ?
            WHERE student_number = ?`,
            [first_name, middle_initial, last_name, gender, degree_program, student_number]
        );

        res.status(200).json({ student_number, first_name, middle_initial, last_name, gender, degree_program });
    } catch (error) {
        console.error("Error updating student: ", error);
        res.status(500).send("Internal server error");
    }
});

// delete a student by student_number
router.delete("/", async (req, res) => {
    const { student_number } = req.body;

    if (!student_number) {
        return res.status(400).send('student_number is required');
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_STUDENTTABLE} WHERE student_number = ?`,
            [student_number]
        );

        if (checkResults[0].count === 0) {
            return res.status(404).send("Student does not exist.");
        }

        await req.pool.query(
            `DELETE FROM ${process.env.DB_STUDENTTABLE} WHERE student_number = ?`,
            [student_number]
        );

        res.status(200).send(`Student ${student_number} deleted successfully`);
    } catch (error) {
        console.error("Error deleting student: ", error);
        res.status(500).send("Internal server error");
    }
});

export default router;
