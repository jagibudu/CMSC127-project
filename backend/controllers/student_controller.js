// controllers/student_controller.js

const table = process.env.DB_STUDENTTABLE || 'STUDENT';

// Helper function for error handling
const handleError = (res, error, msg) => {
  console.error(msg, error);
  res.status(500).send('Internal server error');
};

// Helper function to check if student exists
const studentExists = async (pool, student_number) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${table} WHERE student_number = ?`,
    [student_number]
  );
  return results[0].count > 0;
};

export const getAllStudents = async (req, res) => {
  try {
    const [results] = await req.pool.query(`SELECT * FROM ${table}`);
    res.json(results);
  } catch (error) {
    handleError(res, error, 'Error fetching students:');
  }
};

export const createStudentRecord = async (req, res) => {
  const { 
    student_number, first_name, middle_initial, 
    last_name, gender, degree_program 
  } = req.body;
  
  if (!student_number || !gender) {
    return res.status(400).send('student_number and gender are required');
  }
  
  try {
    if (await studentExists(req.pool, student_number)) {
      return res.status(409).send('Student already exists');
    }

    await req.pool.query(
      `INSERT INTO ${table} 
       (student_number, first_name, middle_initial, 
        last_name, gender, degree_program) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [student_number, first_name, middle_initial, 
       last_name, gender, degree_program]
    );
    
    res.status(201).json({ 
      student_number, first_name, middle_initial, 
      last_name, gender, degree_program 
    });
  } catch (error) {
    handleError(res, error, 'Error inserting student:');
  }
};

export const updateStudentRecord = async (req, res) => {
  const { 
    student_number, first_name, middle_initial, 
    last_name, gender, degree_program 
  } = req.body;
  
  if (!student_number) {
    return res.status(400).send('student_number is required');
  }
  
  try {
    if (!(await studentExists(req.pool, student_number))) {
      return res.status(404).send('Student does not exist');
    }

    await req.pool.query(
      `UPDATE ${table} SET 
       first_name = ?, middle_initial = ?, last_name = ?, 
       gender = ?, degree_program = ? 
       WHERE student_number = ?`,
      [first_name, middle_initial, last_name, 
       gender, degree_program, student_number]
    );
    
    res.status(200).json({ 
      student_number, first_name, middle_initial, 
      last_name, gender, degree_program 
    });
  } catch (error) {
    handleError(res, error, 'Error updating student:');
  }
};

export const deleteStudentRecord = async (req, res) => {
  const { student_number } = req.body;
  
  if (!student_number) {
    return res.status(400).send('student_number is required');
  }
  
  try {
    if (!(await studentExists(req.pool, student_number))) {
      return res.status(404).send('Student does not exist');
    }

    await req.pool.query(
      `DELETE FROM ${table} WHERE student_number = ?`, 
      [student_number]
    );
    
    res.status(200).send(`Student ${student_number} deleted successfully`);
  } catch (error) {
    handleError(res, error, 'Error deleting student:');
  }
};