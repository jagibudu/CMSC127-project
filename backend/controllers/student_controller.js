// controllers/student_controller.js
import Student from '../models/Student.js';

let studentModel = null;

export const initializeModel = (dbPool) => {
    studentModel = new Student(dbPool);
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await studentModel.getAll();
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Internal server error');
    }
};

export const createStudentRecord = async (req, res) => {
    const { student_number, first_name, middle_initial, last_name, gender, degree_program } = req.body;
    
    if (!student_number || !gender) {
        return res.status(400).send('student_number and gender are required');
    }
    
    try {
        if (await studentModel.exists(student_number)) {
            return res.status(409).send('Student already exists');
        }

        await studentModel.create({ student_number, first_name, middle_initial, last_name, gender, degree_program });
        res.status(201).json({ student_number, first_name, middle_initial, last_name, gender, degree_program });
    } catch (error) {
        console.error("Error inserting student:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateStudentRecord = async (req, res) => {
    const { student_number, first_name, middle_initial, last_name, gender, degree_program } = req.body;
    
    if (!student_number) {
        return res.status(400).send('student_number is required');
    }
    
    try {
        if (!(await studentModel.exists(student_number))) {
            return res.status(404).send("Student does not exist");
        }

        await studentModel.update(student_number, { first_name, middle_initial, last_name, gender, degree_program });
        res.status(200).json({ student_number, first_name, middle_initial, last_name, gender, degree_program });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteStudentRecord = async (req, res) => {
    const { student_number } = req.body;
    
    if (!student_number) {
        return res.status(400).send('student_number is required');
    }
    
    try {
        if (!(await studentModel.exists(student_number))) {
            return res.status(404).send("Student does not exist");
        }

        await studentModel.delete(student_number);
        res.status(200).send(`Student ${student_number} deleted successfully`);
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).send("Internal server error");
    }
};