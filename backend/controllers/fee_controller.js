// controllers/fee_controller.js

const table = process.env.DB_FEETABLE || 'FEE';

// Helper function for error handling
const handleError = (res, error, msg) => {
  console.error(msg, error);
  res.status(500).send("Internal server error");
};

// Basic CRUD operations
export const getAllFees = async (req, res) => {
  try {
    const [results] = await req.pool.query(`
      SELECT f.*, s.first_name, s.last_name, o.organization_name 
      FROM ${table} f 
      LEFT JOIN STUDENT s ON f.student_number = s.student_number 
      LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id
    `);
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching fees:");
  }
};

export const getFeesByStudent = async (req, res) => {
  const { student_number } = req.params;
  
  try {
    const [results] = await req.pool.query(
      `SELECT f.*, o.organization_name 
       FROM ${table} f 
       LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
       WHERE f.student_number = ?`,
      [student_number]
    );
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching fees by student:");
  }
};

export const getFeesByOrganization = async (req, res) => {
  const { organization_id } = req.params;
  
  try {
    const [results] = await req.pool.query(
      `SELECT f.*, s.first_name, s.last_name 
       FROM ${table} f 
       LEFT JOIN STUDENT s ON f.student_number = s.student_number 
       WHERE f.organization_id = ?`,
      [organization_id]
    );
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching fees by organization:");
  }
};

export const getUnpaidFees = async (req, res) => {
  try {
    const [results] = await req.pool.query(
      `SELECT f.*, s.first_name, s.last_name, o.organization_name 
       FROM ${table} f 
       LEFT JOIN STUDENT s ON f.student_number = s.student_number 
       LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
       WHERE f.status = 'Unpaid'`
    );
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching unpaid fees:");
  }
};

// Report functions
export const getUnpaidFeesByOrganizationAndSemester = async (req, res) => {
  const { organization_id, year, semester } = req.query;
  
  if (!organization_id || !year || !semester) {
    return res.status(400).send("organization_id, year, and semester required");
  }
  
  try {
    const [results] = await req.pool.query(`
      SELECT f.*, s.first_name, s.last_name, o.organization_name 
      FROM ${table} f 
      LEFT JOIN STUDENT s ON f.student_number = s.student_number 
      LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
      WHERE f.status = 'Unpaid' 
        AND f.organization_id = ? 
        AND YEAR(f.date_issue) = ? 
        AND CASE 
          WHEN ? = 'First' THEN MONTH(f.date_issue) BETWEEN 1 AND 6
          WHEN ? = 'Second' THEN MONTH(f.date_issue) BETWEEN 7 AND 12
          ELSE 1=1
        END
    `, [organization_id, year, semester, semester]);
    res.json(results);
  } catch (error) {
    handleError(res, error, 
      "Error fetching unpaid fees by organization and semester:");
  }
};

export const getUnpaidFeesByStudent = async (req, res) => {
  const { student_number } = req.params;
  
  try {
    const [results] = await req.pool.query(`
      SELECT f.*, o.organization_name 
      FROM ${table} f 
      LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
      WHERE f.status = 'Unpaid' AND f.student_number = ?
    `, [student_number]);
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching unpaid fees by student:");
  }
};

export const getLateFeesByOrganizationAndYear = async (req, res) => {
  const { organization_id, year } = req.query;
  
  if (!organization_id || !year) {
    return res.status(400).send("organization_id and year are required");
  }
  
  try {
    const [results] = await req.pool.query(`
      SELECT f.*, s.first_name, s.last_name, o.organization_name,
        DATEDIFF(CURDATE(), f.due_date) AS days_overdue
      FROM ${table} f 
      LEFT JOIN STUDENT s ON f.student_number = s.student_number 
      LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
      WHERE f.status = 'Late' 
        AND f.organization_id = ? 
        AND YEAR(f.date_issue) = ?
      ORDER BY f.due_date DESC
    `, [organization_id, year]);
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching late fees:");
  }
};

export const getTotalFeesByOrganization = async (req, res) => {
  const { organization_id, as_of_date } = req.query;
  
  if (!organization_id) {
    return res.status(400).send("organization_id is required");
  }
  
  try {
    let query = `
      SELECT 
        COUNT(*) as total_fees,
        SUM(f.amount) as total_amount,
        SUM(CASE WHEN f.status = 'Paid' THEN f.amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN f.status = 'Unpaid' THEN f.amount ELSE 0 END) as unpaid_amount,
        COUNT(CASE WHEN f.status = 'Paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN f.status = 'Unpaid' THEN 1 END) as unpaid_count
      FROM ${table} f 
      WHERE f.organization_id = ?
    `;
    
    const params = [organization_id];
    
    if (as_of_date) {
      query += ' AND f.date_issue <= ?';
      params.push(as_of_date);
    }
    
    const [results] = await req.pool.query(query, params);
    res.json(results[0]);
  } catch (error) {
    handleError(res, error, "Error fetching total fees by organization:");
  }
};

export const getHighestDebtorsBySemester = async (req, res) => {
  const { year, semester, limit } = req.query;
  
  if (!year || !semester) {
    return res.status(400).send("year and semester are required");
  }
  
  try {
    const [results] = await req.pool.query(`
      SELECT 
        f.student_number,
        s.first_name,
        s.last_name,
        SUM(f.amount) as total_debt,
        COUNT(f.fee_id) as fee_count
      FROM ${table} f 
      LEFT JOIN STUDENT s ON f.student_number = s.student_number 
      WHERE f.status = 'Unpaid' 
        AND YEAR(f.date_issue) = ?
        AND CASE 
          WHEN ? = 'First' THEN MONTH(f.date_issue) BETWEEN 1 AND 6
          WHEN ? = 'Second' THEN MONTH(f.date_issue) BETWEEN 7 AND 12
          ELSE 1=1
        END
      GROUP BY f.student_number, s.first_name, s.last_name
      ORDER BY total_debt DESC
      LIMIT ?
    `, [year, semester, semester, parseInt(limit) || 1]);
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching highest debtors:");
  }
};

// Helper function to check if fee exists
const feeExists = async (pool, fee_id) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${table} WHERE fee_id = ?`,
    [fee_id]
  );
  return results[0].count > 0;
};

// CRUD operations
export const createFeeRecord = async (req, res) => {
  const { 
    fee_id, label, status, amount, 
    date_issue, due_date, organization_id, student_number 
  } = req.body;
  
  if (!fee_id || !amount || !organization_id || !student_number) {
    return res.status(400).send(
      "fee_id, amount, organization_id, and student_number are required"
    );
  }
  
  try {
    if (await feeExists(req.pool, fee_id)) {
      return res.status(409).send("Fee already exists");
    }

    await req.pool.query(
      `INSERT INTO ${table} 
       (fee_id, label, status, amount, date_issue, due_date, 
        organization_id, student_number) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [fee_id, label, status || 'Unpaid', amount, 
       date_issue, due_date, organization_id, student_number]
    );
    
    res.status(201).json({ 
      fee_id, label, status: status || 'Unpaid', amount, 
      date_issue, due_date, organization_id, student_number 
    });
  } catch (error) {
    handleError(res, error, "Error creating fee:");
  }
};

export const updateFeeRecord = async (req, res) => {
  const { 
    fee_id, label, status, amount, 
    date_issue, due_date, organization_id, student_number 
  } = req.body;
  
  if (!fee_id) {
    return res.status(400).send("fee_id is required");
  }
  
  try {
    if (!(await feeExists(req.pool, fee_id))) {
      return res.status(404).send("Fee does not exist");
    }

    await req.pool.query(
      `UPDATE ${table} SET 
       label = ?, status = ?, amount = ?, date_issue = ?, 
       due_date = ?, organization_id = ?, student_number = ? 
       WHERE fee_id = ?`,
      [label, status, amount, date_issue, due_date, 
       organization_id, student_number, fee_id]
    );
    
    res.status(200).json({ 
      fee_id, label, status, amount, 
      date_issue, due_date, organization_id, student_number 
    });
  } catch (error) {
    handleError(res, error, "Error updating fee:");
  }
};

export const updateFeeStatus = async (req, res) => {
  const { fee_id, status } = req.body;
  
  if (!fee_id || !status) {
    return res.status(400).send("fee_id and status are required");
  }
  
  try {
    if (!(await feeExists(req.pool, fee_id))) {
      return res.status(404).send("Fee does not exist");
    }

    await req.pool.query(
      `UPDATE ${table} SET status = ? WHERE fee_id = ?`,
      [status, fee_id]
    );
    
    res.status(200).json({ 
      fee_id, status, message: "Fee status updated successfully" 
    });
  } catch (error) {
    handleError(res, error, "Error updating fee status:");
  }
};

export const deleteFeeRecord = async (req, res) => {
  const { fee_id } = req.body;
  
  if (!fee_id) {
    return res.status(400).send("fee_id is required");
  }
  
  try {
    if (!(await feeExists(req.pool, fee_id))) {
      return res.status(404).send("Fee does not exist");
    }

    await req.pool.query(`DELETE FROM ${table} WHERE fee_id = ?`, [fee_id]);
    res.status(200).send(`Fee ${fee_id} deleted successfully`);
  } catch (error) {
    handleError(res, error, "Error deleting fee:");
  }
};

// Bonus utility functions
export const updateOverdueFees = async (req, res) => {
  try {
    await req.pool.query(`
      UPDATE ${table} 
      SET status = 'Late' 
      WHERE status = 'Unpaid' AND due_date < CURDATE()
    `);
    res.status(200).send("Overdue fees updated to Late status");
  } catch (error) {
    handleError(res, error, "Error updating overdue fees:");
  }
};

export const getOverdueUnpaidFees = async (req, res) => {
  try {
    const [results] = await req.pool.query(`
      SELECT f.*, s.first_name, s.last_name, o.organization_name,
        DATEDIFF(CURDATE(), f.due_date) AS days_overdue
      FROM ${table} f 
      LEFT JOIN STUDENT s ON f.student_number = s.student_number 
      LEFT JOIN ORGANIZATION o ON f.organization_id = o.organization_id 
      WHERE f.status = 'Unpaid' AND f.due_date < CURDATE()
      ORDER BY days_overdue DESC
    `);
    res.json(results);
  } catch (error) {
    handleError(res, error, "Error fetching overdue unpaid fees:");
  }
};