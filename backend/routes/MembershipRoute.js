
// Add these imports to your membership_controller import
import { 
    getAllMemberships,
    getAllMembershipsWithBalance,
    getMembershipsByStudent,
    getMembershipsByOrganization,
    getActiveMembers,
    getMembersByFilters,              // ADD THIS
    getExecutiveCommitteeMembers,     // ADD THIS
    getMembersByRole,                 // ADD THIS  
    getMembershipStatusPercentage,    // ADD THIS
    getAlumniMembers,                 // ADD THIS
    createMembershipRecord,
    updateMembershipRecord,
    updateMembershipStatus,
    deleteMembershipRecord
} from '../controllers/membership_controller.js';

const router = express.Router();

// Get all memberships
router.get("/", getAllMemberships);

// Get all memberships with balance
router.get("/balance", getAllMembershipsWithBalance);

// Get active members (optionally filtered by organization)
router.get("/active", getActiveMembers);

// Get memberships by student
router.get("/student/:student_number", getMembershipsByStudent);

// Get memberships by organization
router.get("/organization/:organization_id", getMembershipsByOrganization);

// Create a new membership
router.post("/", createMembershipRecord);

// Update membership
router.put("/", updateMembershipRecord);

// Update membership status only
router.patch("/status", updateMembershipStatus);

// Delete membership
router.delete("/", deleteMembershipRecord);

// NEW REPORT ROUTES
// Get members by various filters
router.get("/filter", getMembersByFilters);

// Get executive committee members
router.get("/executive", getExecutiveCommitteeMembers);

// Get members by role
router.get("/role/:role", getMembersByRole);

// Get membership status percentage
router.get("/status-percentage", getMembershipStatusPercentage);

// Get alumni members
router.get("/alumni", getAlumniMembers);

export default router;