// routes/StudentRoute.js
import express from "express";
import { 
    getAllStudents, 
    createStudentRecord,
    updateStudentRecord,
    deleteStudentRecord
} from '../controllers/student_controller.js';

const router = express.Router();

// Get all students
router.get('/', getAllStudents);

// Insert a new student to the database
router.post("/", createStudentRecord);

// Update student (using body instead of params)
router.put("/", updateStudentRecord);

// Delete a student by student_number (using body instead of params)
router.delete("/", deleteStudentRecord);

export default router;