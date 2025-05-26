// routes/FeeRoute.js
import express from "express";
import { 
    getAllFees, 
    getFeesByStudent,
    getFeesByOrganization,
    getUnpaidFees,
    createFeeRecord,
    updateFeeRecord,
    updateFeeStatus,
    deleteFeeRecord
} from '../controllers/fee_controller.js';

const router = express.Router();

// Get all fees
router.get("/", getAllFees);

// Get unpaid fees
router.get("/unpaid", getUnpaidFees);

// Get fees by student
router.get("/student/:student_number", getFeesByStudent);

// Get fees by organization
router.get("/organization/:organization_id", getFeesByOrganization);

// Create a new fee
router.post("/", createFeeRecord);

// Update fee
router.put("/", updateFeeRecord);

// Update fee status only
router.patch("/status", updateFeeStatus);

// Delete fee
router.delete("/", deleteFeeRecord);

export default router;