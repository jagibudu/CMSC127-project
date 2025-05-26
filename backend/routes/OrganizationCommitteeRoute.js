// routes/OrganizationCommitteeRoute.js
import express from "express";
import { 
    getAllCommittees, 
    getCommitteesByOrganization, 
    createCommitteeRecord,
    updateCommitteeRecord,
    deleteCommitteeRecord
} from '../controllers/organization_committee_controller.js';

const router = express.Router();

// Get all organization committees
router.get("/", getAllCommittees);

// Get committees by organization_id
router.get("/:organization_id", getCommitteesByOrganization);

// Insert a new organization committee
router.post("/", createCommitteeRecord);

// Update organization committee (using body instead of params)
router.put("/", updateCommitteeRecord);

// Delete organization committee (using body instead of params)
router.delete("/", deleteCommitteeRecord);

export default router;