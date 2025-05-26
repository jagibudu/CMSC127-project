// controllers/organization_event_controller.js
import OrganizationEvent from '../models/OrganizationEvent.js';

export const getAllEvents = async (req, res) => {
    try {
        const eventModel = new OrganizationEvent(req.pool);
        const events = await eventModel.getAll();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Internal server error");
    }
};

export const getEventsByOrganization = async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const eventModel = new OrganizationEvent(req.pool);
        const events = await eventModel.getByOrganization(organization_id);
        res.json(events);
    } catch (error) {
        console.error("Error fetching events by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const createEventRecord = async (req, res) => {
    const { organization_id, event_name } = req.body;
    
    if (!organization_id || !event_name) {
        return res.status(400).send("organization_id and event_name are required");
    }
    
    try {
        const eventModel = new OrganizationEvent(req.pool);
        const event_id = await eventModel.create({ organization_id, event_name });
        res.status(201).json({ event_id, organization_id, event_name });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateEventRecord = async (req, res) => {
    const { event_id, organization_id, event_name } = req.body;
    
    if (!event_id) {
        return res.status(400).send("event_id is required");
    }
    
    try {
        const eventModel = new OrganizationEvent(req.pool);
        
        if (!(await eventModel.exists(event_id))) {
            return res.status(404).send("Event does not exist");
        }

        await eventModel.update(event_id, { organization_id, event_name });
        res.status(200).json({ event_id, organization_id, event_name });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteEventRecord = async (req, res) => {
    const { event_id } = req.body;
    
    if (!event_id) {
        return res.status(400).send("event_id is required");
    }
    
    try {
        const eventModel = new OrganizationEvent(req.pool);
        
        if (!(await eventModel.exists(event_id))) {
            return res.status(404).send("Event does not exist");
        }

        await eventModel.delete(event_id);
        res.status(200).send(`Event ${event_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).send("Internal server error");
    }
};