// controllers/fee_controller.js
import Fee from '../models/Fee.js';

export const getAllFees = async (req, res) => {
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getAll();
        res.json(fees);
    } catch (error) {
        console.error("Error fetching fees:", error);
        res.status(500).send("Internal server error");
    }
};

export const getFeesByStudent = async (req, res) => {
    const { student_number } = req.params;
    
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getByStudent(student_number);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching fees by student:", error);
        res.status(500).send("Internal server error");
    }
};

export const getFeesByOrganization = async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getByOrganization(organization_id);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching fees by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const getUnpaidFees = async (req, res) => {
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getUnpaidFees();
        res.json(fees);
    } catch (error) {
        console.error("Error fetching unpaid fees:", error);
        res.status(500).send("Internal server error");
    }
};

// NEW REPORT FUNCTIONS
export const getUnpaidFeesByOrganizationAndSemester = async (req, res) => {
    const { organization_id, year, semester } = req.query;
    
    if (!organization_id || !year || !semester) {
        return res.status(400).send("organization_id, year, and semester are required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getUnpaidFeesByOrganizationAndSemester(organization_id, year, semester);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching unpaid fees by organization and semester:", error);
        res.status(500).send("Internal server error");
    }
};

export const getUnpaidFeesByStudent = async (req, res) => {
    const { student_number } = req.params;
    
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getUnpaidFeesByStudent(student_number);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching unpaid fees by student:", error);
        res.status(500).send("Internal server error");
    }
};

export const getLateFeesByOrganizationAndYear = async (req, res) => {
    const { organization_id, year } = req.query;
    
    if (!organization_id || !year) {
        return res.status(400).send("organization_id and year are required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        const fees = await feeModel.getLateFeesByOrganizationAndYear(organization_id, year);
        res.json(fees);
    } catch (error) {
        console.error("Error fetching late fees:", error);
        res.status(500).send("Internal server error");
    }
};

export const getTotalFeesByOrganization = async (req, res) => {
    const { organization_id, as_of_date } = req.query;
    
    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        const totals = await feeModel.getTotalFeesByOrganization(organization_id, as_of_date);
        res.json(totals);
    } catch (error) {
        console.error("Error fetching total fees by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const getHighestDebtorsBySemester = async (req, res) => {
    const { year, semester, limit } = req.query;
    
    if (!year || !semester) {
        return res.status(400).send("year and semester are required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        const debtors = await feeModel.getHighestDebtorsBySemester(year, semester, limit || 1);
        res.json(debtors);
    } catch (error) {
        console.error("Error fetching highest debtors:", error);
        res.status(500).send("Internal server error");
    }
};

export const createFeeRecord = async (req, res) => {
    const { fee_id, label, status, amount, date_issue, due_date, organization_id, student_number } = req.body;
    
    if (!fee_id || !amount || !organization_id || !student_number) {
        return res.status(400).send("fee_id, amount, organization_id, and student_number are required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        
        if (await feeModel.exists(fee_id)) {
            return res.status(409).send("Fee already exists");
        }

        await feeModel.create({ fee_id, label, status, amount, date_issue, due_date, organization_id, student_number });
        res.status(201).json({ fee_id, label, status: status || 'Unpaid', amount, date_issue, due_date, organization_id, student_number });
    } catch (error) {
        console.error("Error creating fee:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateFeeRecord = async (req, res) => {
    const { fee_id, label, status, amount, date_issue, due_date, organization_id, student_number } = req.body;
    
    if (!fee_id) {
        return res.status(400).send("fee_id is required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        
        if (!(await feeModel.exists(fee_id))) {
            return res.status(404).send("Fee does not exist");
        }

        await feeModel.update(fee_id, { label, status, amount, date_issue, due_date, organization_id, student_number });
        res.status(200).json({ fee_id, label, status, amount, date_issue, due_date, organization_id, student_number });
    } catch (error) {
        console.error("Error updating fee:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateFeeStatus = async (req, res) => {
    const { fee_id, status } = req.body;
    
    if (!fee_id || !status) {
        return res.status(400).send("fee_id and status are required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        
        if (!(await feeModel.exists(fee_id))) {
            return res.status(404).send("Fee does not exist");
        }

        await feeModel.updateStatus(fee_id, status);
        res.status(200).json({ fee_id, status, message: "Fee status updated successfully" });
    } catch (error) {
        console.error("Error updating fee status:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteFeeRecord = async (req, res) => {
    const { fee_id } = req.body;
    
    if (!fee_id) {
        return res.status(400).send("fee_id is required");
    }
    
    try {
        const feeModel = new Fee(req.pool);
        
        if (!(await feeModel.exists(fee_id))) {
            return res.status(404).send("Fee does not exist");
        }

        await feeModel.delete(fee_id);
        res.status(200).send(`Fee ${fee_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting fee:", error);
        res.status(500).send("Internal server error");
    }
};