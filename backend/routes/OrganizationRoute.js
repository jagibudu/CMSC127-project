// routes/OrganizationRoute.js
import express from "express";
import { 
    getAllOrganizations, 
    createOrganizationRecord,
    updateOrganizationRecord,
    deleteOrganizationRecord
} from '../controllers/organization_controller.js';

const router = express.Router();

// Get all organizations
router.get("/", getAllOrganizations);

// Insert a new organization
router.post("/", createOrganizationRecord);

// Update organization name (using body instead of params)
router.put("/", updateOrganizationRecord);

// Delete organization (using body instead of params)
router.delete("/", deleteOrganizationRecord);

export default router;