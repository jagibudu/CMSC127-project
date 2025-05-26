// routes/MembershipRoute.js
import express from "express";
import { 
    getAllMemberships,
    getAllMembershipsWithBalance,
    getMembershipsByStudent,
    getMembershipsByOrganization,
    getActiveMembers,
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

export default router;