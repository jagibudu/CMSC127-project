// routes/OrganizationEventRoute.js
import express from "express";
import { 
    getAllEvents, 
    getEventsByOrganization, 
    createEventRecord,
    updateEventRecord,
    deleteEventRecord
} from '../controllers/organization_event_controller.js';

const router = express.Router();

// Get all organization events
router.get("/", getAllEvents);

// Get events by organization_id
router.get("/:organization_id", getEventsByOrganization);

// Create a new organization event
router.post("/", createEventRecord);

// Update organization event
router.put("/", updateEventRecord);

// Delete organization event
router.delete("/", deleteEventRecord);

export default router;