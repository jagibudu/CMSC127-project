// controllers/organization_committee_controller.js
import OrganizationCommittee from '../models/OrganizationCommittee.js';

let committeeModel = null;

export const initializeModel = (dbPool) => {
    committeeModel = new OrganizationCommittee(dbPool);
};

export const getAllCommittees = async (req, res) => {
    try {
        const committees = await committeeModel.getAll();
        res.json(committees);
    } catch (error) {
        console.error("Error fetching organization committees:", error);
        res.status(500).send("Internal server error");
    }
};

export const getCommitteesByOrganization = async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const committees = await committeeModel.getByOrganization(organization_id);
        res.json(committees);
    } catch (error) {
        console.error("Error fetching committees by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const createCommitteeRecord = async (req, res) => {
    const { organization_id, committee_name } = req.body;
    
    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }
    
    try {
        const committee_id = await committeeModel.create({ organization_id, committee_name });
        res.status(201).json({ committee_id, organization_id, committee_name });
    } catch (error) {
        console.error("Error inserting organization committee:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateCommitteeRecord = async (req, res) => {
    const { committee_id, organization_id, committee_name } = req.body;
    
    if (!committee_id) {
        return res.status(400).send("committee_id is required");
    }
    
    try {
        if (!(await committeeModel.exists(committee_id))) {
            return res.status(404).send("Committee does not exist");
        }

        await committeeModel.update(committee_id, { organization_id, committee_name });
        res.status(200).json({ committee_id, organization_id, committee_name });
    } catch (error) {
        console.error("Error updating organization committee:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteCommitteeRecord = async (req, res) => {
    const { committee_id } = req.body;
    
    if (!committee_id) {
        return res.status(400).send("committee_id is required");
    }
    
    try {
        if (!(await committeeModel.exists(committee_id))) {
            return res.status(404).send("Committee does not exist");
        }

        await committeeModel.delete(committee_id);
        res.status(200).send(`Committee ${committee_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization committee:", error);
        res.status(500).send("Internal server error");
    }
};