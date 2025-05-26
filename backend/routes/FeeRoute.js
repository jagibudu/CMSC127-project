// Add these imports to your fee_controller import
import { 
    getAllFees, 
    getFeesByStudent,
    getFeesByOrganization,
    getUnpaidFees,
    getUnpaidFeesByOrganizationAndSemester,  // ADD THIS
    getUnpaidFeesByStudent,                   // ADD THIS  
    getLateFeesByOrganizationAndYear,        // ADD THIS
    getTotalFeesByOrganization,              // ADD THIS
    getHighestDebtorsBySemester,             // ADD THIS
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

// NEW REPORT ROUTES
// Get unpaid fees by organization and semester
router.get("/unpaid/organization-semester", getUnpaidFeesByOrganizationAndSemester);

// Get unpaid fees by student  
router.get("/unpaid/student/:student_number", getUnpaidFeesByStudent);

// Get late fees by organization and year
router.get("/late", getLateFeesByOrganizationAndYear);

// Get total fees by organization
router.get("/totals", getTotalFeesByOrganization);

// Get highest debtors by semester
router.get("/debtors", getHighestDebtorsBySemester);

export default router;