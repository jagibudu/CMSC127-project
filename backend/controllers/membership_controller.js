// controllers/membership_controller.js
import Membership from '../models/Membership.js';

export const getAllMemberships = async (req, res) => {
    try {
        const membershipModel = new Membership(req.pool);
        const memberships = await membershipModel.getAll();
        res.json(memberships);
    } catch (error) {
        console.error("Error fetching memberships:", error);
        res.status(500).send("Internal server error");
    }
};

export const getAllMembershipsWithBalance = async (req, res) => {
    try {
        const membershipModel = new Membership(req.pool);
        const memberships = await membershipModel.getAllWithBalance();
        res.json(memberships);
    } catch (error) {
        console.error("Error fetching memberships with balance:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembershipsByStudent = async (req, res) => {
    const { student_number } = req.params;
    
    try {
        const membershipModel = new Membership(req.pool);
        const memberships = await membershipModel.getByStudent(student_number);
        res.json(memberships);
    } catch (error) {
        console.error("Error fetching memberships by student:", error);
        res.status(500).send("Internal server error");
    }
};

export const getMembershipsByOrganization = async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const membershipModel = new Membership(req.pool);
        const memberships = await membershipModel.getByOrganization(organization_id);
        res.json(memberships);
    } catch (error) {
        console.error("Error fetching memberships by organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const getActiveMembers = async (req, res) => {
    const { organization_id } = req.query;
    
    try {
        const membershipModel = new Membership(req.pool);
        const members = await membershipModel.getActiveMembers(organization_id);
        res.json(members);
    } catch (error) {
        console.error("Error fetching active members:", error);
        res.status(500).send("Internal server error");
    }
};

export const createMembershipRecord = async (req, res) => {
    const { student_number, organization_id, committee_id, membership_date, status, role } = req.body;
    
    if (!student_number || !organization_id) {
        return res.status(400).send("student_number and organization_id are required");
    }
    
    try {
        const membershipModel = new Membership(req.pool);
        
        if (await membershipModel.exists(student_number, organization_id)) {
            return res.status(409).send("Membership already exists");
        }

        await membershipModel.create({ student_number, organization_id, committee_id, membership_date, status, role });
        res.status(201).json({ 
            student_number, 
            organization_id, 
            committee_id, 
            membership_date, 
            status: status || 'Active', 
            role: role || 'Member' 
        });
    } catch (error) {
        console.error("Error creating membership:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateMembershipRecord = async (req, res) => {
    const { student_number, organization_id, committee_id, membership_date, status, role } = req.body;
    
    if (!student_number || !organization_id) {
        return res.status(400).send("student_number and organization_id are required");
    }
    
    try {
        const membershipModel = new Membership(req.pool);
        
        if (!(await membershipModel.exists(student_number, organization_id))) {
            return res.status(404).send("Membership does not exist");
        }

        await membershipModel.update(student_number, organization_id, { committee_id, membership_date, status, role });
        res.status(200).json({ student_number, organization_id, committee_id, membership_date, status, role });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateMembershipStatus = async (req, res) => {
    const { student_number, organization_id, status } = req.body;
    
    if (!student_number || !organization_id || !status) {
        return res.status(400).send("student_number, organization_id, and status are required");
    }
    
    try {
        const membershipModel = new Membership(req.pool);
        
        if (!(await membershipModel.exists(student_number, organization_id))) {
            return res.status(404).send("Membership does not exist");
        }

        await membershipModel.updateStatus(student_number, organization_id, status);
        res.status(200).json({ student_number, organization_id, status, message: "Membership status updated successfully" });
    } catch (error) {
        console.error("Error updating membership status:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteMembershipRecord = async (req, res) => {
    const { student_number, organization_id } = req.body;
    
    if (!student_number || !organization_id) {
        return res.status(400).send("student_number and organization_id are required");
    }
    
    try {
        const membershipModel = new Membership(req.pool);
        
        if (!(await membershipModel.exists(student_number, organization_id))) {
            return res.status(404).send("Membership does not exist");
        }

        await membershipModel.delete(student_number, organization_id);
        res.status(200).send(`Membership for student ${student_number} in organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting membership:", error);
        res.status(500).send("Internal server error");
    }
};