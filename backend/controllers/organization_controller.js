// controllers/organization_controller.js

export const getAllOrganizations = async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_ORGANIZATIONTABLE}`);
        res.json(results);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).send("Internal server error");
    }
};

export const createOrganizationRecord = async (req, res) => {
    const { organization_id, organization_name } = req.body;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        const table = process.env.DB_ORGANIZATIONTABLE;
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${table} WHERE organization_id = ?`, [organization_id]);
        
        if (existing[0].count > 0) return res.status(409).send("Organization already exists");

        await req.pool.query(`INSERT INTO ${table} (organization_id, organization_name) VALUES (?, ?)`, [organization_id, organization_name]);
        res.status(201).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error inserting organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const updateOrganizationRecord = async (req, res) => {
    const { organization_id, organization_name } = req.body;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        const table = process.env.DB_ORGANIZATIONTABLE;
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${table} WHERE organization_id = ?`, [organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Organization does not exist");

        await req.pool.query(`UPDATE ${table} SET organization_name = ? WHERE organization_id = ?`, [organization_name, organization_id]);
        res.status(200).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).send("Internal server error");
    }
};

export const deleteOrganizationRecord = async (req, res) => {
    const { organization_id } = req.body;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        const table = process.env.DB_ORGANIZATIONTABLE;
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${table} WHERE organization_id = ?`, [organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Organization does not exist");

        await req.pool.query(`DELETE FROM ${table} WHERE organization_id = ?`, [organization_id]);
        res.status(200).send(`Organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).send("Internal server error");
    }
};