// controllers/membership_controller.js

const BELONGS_TO = process.env.DB_BELONGSTOTABLE || 'BELONGS_TO';
const BELONGS_TO_VIEW = 'BELONGS_TO_WITH_BALANCE';

export const getAllMemberships = async (req, res) => {
    try {
        const [results] = await req.pool.query(`
            SELECT bt.*, s.first_name, s.last_name, s.gender, s.degree_program, 
                   o.organization_name, oc.committee_name
            FROM ${BELONGS_TO} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION o ON bt.organization_id = o.organization_id
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
        `);
        res.json(results);
    } catch (error) {
        console.error("Error fetching memberships:", error);
        res.status(500).send("Internal server error");
    }
};

export const getAllMembershipsWithBalance = async (req, res) => {
    try {
        const [results] = await req.pool.query(`
            SELECT btwb.*, s.first_name, s.last_name, s.gender, s.degree_program, 
                   o.organization_name
            FROM ${BELONGS_TO_VIEW} btwb
            LEFT JOIN STUDENT s ON btwb.student_number = s.student_number
            LEFT JOIN ORGANIZATION o ON btwb.organization_id = o.organization_id
        `);
        res.json(results);
    } catch (error) {
        console.error("Error fetching memberships with balance:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembershipsByStudent = async (req, res) => {
    const { student_number } = req.params;
    
    try {
        const [results] = await req.pool.query(`
            SELECT bt.*, s.first_name, s.last_name, s.gender, s.degree_program,
                   o.organization_name, oc.committee_name
            FROM ${BELONGS_TO} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION o ON bt.organization_id = o.organization_id
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
            WHERE bt.student_number = ?
        `, [student_number]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching memberships by student:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembershipsByOrganization = async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const [results] = await req.pool.query(`
            SELECT bt.*, s.first_name, s.last_name, s.gender, s.degree_program, 
                   oc.committee_name
            FROM ${BELONGS_TO} bt
            LEFT JOIN STUDENT s ON bt.student_number = s.student_number
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id
            WHERE bt.organization_id = ?
        `, [organization_id]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching memberships by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const getActiveMembers = async (req, res) => {
    const { organization_id } = req.query;
    
    try {
        let query = `
            SELECT bt.*, s.first_name, s.last_name, s.gender, s.degree_program,
                   o.organization_name, oc.committee_name
            FROM ${BELONGS_TO} bt
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
        
        const [results] = await req.pool.query(query, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching active members:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembersByFilters = async (req, res) => {
    const { role, status, gender, degree_program, batch, committee_name, organization_id } = req.query;
    
    try {
        let query = `
            SELECT s.student_number, CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                   s.gender, s.degree_program, YEAR(bt.membership_date) AS batch, 
                   o.organization_name, oc.committee_name, bt.role, bt.status, bt.remaining_balance 
            FROM STUDENT s 
            JOIN ${BELONGS_TO_VIEW} bt ON s.student_number = bt.student_number 
            JOIN ORGANIZATION o ON bt.organization_id = o.organization_id 
            LEFT JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id 
            WHERE 1 = 1
        `;
        
        const params = [];
        
        if (role) { query += ' AND bt.role = ?'; params.push(role); }
        if (status) { query += ' AND bt.status = ?'; params.push(status); }
        if (gender) { query += ' AND s.gender = ?'; params.push(gender); }
        if (degree_program) { query += ' AND s.degree_program = ?'; params.push(degree_program); }
        if (batch) { query += ' AND YEAR(bt.membership_date) = ?'; params.push(batch); }
        if (committee_name) { query += ' AND oc.committee_name = ?'; params.push(committee_name); }
        if (organization_id) { query += ' AND bt.organization_id = ?'; params.push(organization_id); }
        
        query += ' ORDER BY o.organization_name, bt.role, s.last_name, s.first_name';
        
        const [results] = await req.pool.query(query, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching members by filters:", error);
        res.status(500).send("Internal server error");
    }
};

export const getExecutiveCommitteeMembers = async (req, res) => {
    const { organization_id, year } = req.query;
    
    if (!organization_id || !year) return res.status(400).send("organization_id and year are required");
    
    try {
        const [results] = await req.pool.query(`
            SELECT s.student_number, CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                   s.gender, s.degree_program, o.organization_name, oc.committee_name, 
                   bt.role, bt.membership_date, bt.status 
            FROM ${BELONGS_TO} bt 
            JOIN STUDENT s ON bt.student_number = s.student_number 
            JOIN ORGANIZATION o ON bt.organization_id = o.organization_id 
            JOIN ORGANIZATION_COMMITTEE oc ON bt.committee_id = oc.committee_id 
            WHERE oc.committee_name = 'Executive Committee' 
                AND bt.organization_id = ? AND YEAR(bt.membership_date) = ?
            ORDER BY s.last_name, s.first_name
        `, [organization_id, year]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching executive committee members:", error);
        res.status(500).send("Internal server error");
    }
};

export const getRoles = async (req, res) => {
    const { organization_id } = req.query;
    
    try {
        let query = `SELECT DISTINCT role FROM ${BELONGS_TO} WHERE role IS NOT NULL AND role != ''`;
        const params = [];
        
        if (organization_id) {
            query += ' AND organization_id = ?';
            params.push(organization_id);
        }
        
        query += ' ORDER BY role';
        
        const [results] = await req.pool.query(query, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembersByRole = async (req, res) => {
    const { role } = req.params;
    
    try {
        const [results] = await req.pool.query(`
            SELECT s.student_number, CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                   s.gender, s.degree_program, o.organization_name, bt.role, 
                   YEAR(bt.membership_date) AS year_joined, bt.status 
            FROM ${BELONGS_TO} bt 
            JOIN STUDENT s ON bt.student_number = s.student_number 
            JOIN ORGANIZATION o ON bt.organization_id = o.organization_id 
            WHERE bt.role = ?
            ORDER BY YEAR(bt.membership_date) DESC, s.last_name, s.first_name
        `, [role]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching members by role:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembershipStatusPercentage = async (req, res) => {
    const { organization_id, years_back } = req.query;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        const start_year = new Date().getFullYear() - (years_back || 1);
        
        const [results] = await req.pool.query(`
            SELECT status, COUNT(*) AS count, 
                   ROUND(100 * COUNT(*) / ( 
                       SELECT COUNT(*) FROM ${BELONGS_TO}
                       WHERE YEAR(membership_date) >= ? AND organization_id = ? 
                   ), 2) AS percentage 
            FROM ${BELONGS_TO}
            WHERE YEAR(membership_date) >= ? AND organization_id = ? 
            GROUP BY status
        `, [start_year, organization_id, start_year, organization_id]);
        res.json(results);
    } catch (error) {
        console.error("Error fetching membership status percentage:", error);
        res.status(500).send("Internal server error");
    }
};

export const getAlumniMembers = async (req, res) => {
    const { organization_id, as_of_date } = req.query;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        let query = `
            SELECT s.student_number, CONCAT(s.first_name, ' ', s.last_name) AS full_name, 
                   s.gender, s.degree_program, bt.membership_date, o.organization_name 
            FROM ${BELONGS_TO} bt 
            JOIN STUDENT s ON bt.student_number = s.student_number 
            JOIN ORGANIZATION o ON bt.organization_id = o.organization_id 
            WHERE bt.status = 'Alumni' AND bt.organization_id = ?
        `;
        const params = [organization_id];
        
        if (as_of_date) {
            query += ' AND bt.membership_date <= ?';
            params.push(as_of_date);
        }
        
        query += ' ORDER BY s.last_name, s.first_name';
        
        const [results] = await req.pool.query(query, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching alumni members:", error);
        res.status(500).send("Internal server error");
    }
};

export const createMembershipRecord = async (req, res) => {
    const { student_number, organization_id, committee_id, membership_date, status, role } = req.body;
    
    if (!student_number || !organization_id) return res.status(400).send("student_number and organization_id are required");
    
    try {
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${BELONGS_TO} WHERE student_number = ? AND organization_id = ?`, [student_number, organization_id]);
        
        if (existing[0].count > 0) return res.status(409).send("Membership already exists");

        await req.pool.query(
            `INSERT INTO ${BELONGS_TO} (student_number, organization_id, committee_id, membership_date, status, role) VALUES (?, ?, ?, ?, ?, ?)`,
            [student_number, organization_id, committee_id, membership_date, status || 'Active', role || 'Member']
        );
        res.status(201).json({ student_number, organization_id, committee_id, membership_date, status: status || 'Active', role: role || 'Member' });
    } catch (error) {
        console.error("Error creating membership:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateMembershipRecord = async (req, res) => {
    const { student_number, organization_id, committee_id, membership_date, status, role } = req.body;
    
    if (!student_number || !organization_id) return res.status(400).send("student_number and organization_id are required");
    
    try {
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${BELONGS_TO} WHERE student_number = ? AND organization_id = ?`, [student_number, organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Membership does not exist");

        await req.pool.query(
            `UPDATE ${BELONGS_TO} SET committee_id = ?, membership_date = ?, status = ?, role = ? WHERE student_number = ? AND organization_id = ?`,
            [committee_id, membership_date, status, role, student_number, organization_id]
        );
        res.status(200).json({ student_number, organization_id, committee_id, membership_date, status, role });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateMembershipStatus = async (req, res) => {
    const { student_number, organization_id, status } = req.body;
    
    if (!student_number || !organization_id || !status) return res.status(400).send("student_number, organization_id, and status are required");
    
    try {
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${BELONGS_TO} WHERE student_number = ? AND organization_id = ?`, [student_number, organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Membership does not exist");

        await req.pool.query(`UPDATE ${BELONGS_TO} SET status = ? WHERE student_number = ? AND organization_id = ?`, [status, student_number, organization_id]);
        res.status(200).json({ student_number, organization_id, status, message: "Membership status updated successfully" });
    } catch (error) {
        console.error("Error updating membership status:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteMembershipRecord = async (req, res) => {
    const { student_number, organization_id } = req.body;
    
    if (!student_number || !organization_id) return res.status(400).send("student_number and organization_id are required");
    
    try {
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${BELONGS_TO} WHERE student_number = ? AND organization_id = ?`, [student_number, organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Membership does not exist");

        await req.pool.query(`DELETE FROM ${BELONGS_TO} WHERE student_number = ? AND organization_id = ?`, [student_number, organization_id]);
        res.status(200).send(`Membership for student ${student_number} in organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting membership:", error);
        res.status(500).send("Internal server error");
    }
};