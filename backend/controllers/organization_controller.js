// controllers/organization_controller.js
import Organization from '../models/Organization.js';

export const getAllOrganizations = async (req, res) => {
    try {
        const organizationModel = new Organization(req.pool);
        const organizations = await organizationModel.getAll();
        res.json(organizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).send("Internal server error");
    }
};

export const createOrganizationRecord = async (req, res) => {
    const { organization_id, organization_name } = req.body;
    
    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }
    
    try {
        const organizationModel = new Organization(req.pool);
        
        if (await organizationModel.exists(organization_id)) {
            return res.status(409).send("Organization already exists");
        }

        await organizationModel.create({ organization_id, organization_name });
        res.status(201).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error inserting organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateOrganizationRecord = async (req, res) => {
    const { organization_id, organization_name } = req.body;
    
    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }
    
    try {
        const organizationModel = new Organization(req.pool);
        
        if (!(await organizationModel.exists(organization_id))) {
            return res.status(404).send("Organization does not exist");
        }

        await organizationModel.update(organization_id, { organization_name });
        res.status(200).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteOrganizationRecord = async (req, res) => {
    const { organization_id } = req.body;
    
    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }
    
    try {
        const organizationModel = new Organization(req.pool);
        
        if (!(await organizationModel.exists(organization_id))) {
            return res.status(404).send("Organization does not exist");
        }

        await organizationModel.delete(organization_id);
        res.status(200).send(`Organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).send("Internal server error");
    }
};