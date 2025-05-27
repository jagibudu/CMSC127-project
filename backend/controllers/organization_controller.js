// controllers/organization_controller.js
const table = process.env.DB_ORGANIZATIONTABLE;
const FEE_TABLE = process.env.DB_FEETABLE || 'FEE';
const BELONGS_TO_TABLE = process.env.DB_BELONGSTOTABLE || 'BELONGS_TO';
const COMMITTEE_TABLE = process.env.DB_ORGANIZATIONCOMMITTEETABLE;
const EVENT_TABLE = process.env.DB_ORGANIZATIONEVENTTABLE || 'ORGANIZATION_EVENT';

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


// Helper function to check for dependent records
const hasDependentRecords = async (pool, organization_id) => {
  const [feeResults] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${FEE_TABLE} WHERE organization_id = ?`,
    [organization_id]
  );
  const [membershipResults] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${BELONGS_TO_TABLE} WHERE organization_id = ?`,
    [organization_id]
  );
  const [committeeResults] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${COMMITTEE_TABLE} WHERE organization_id = ?`,
    [organization_id]
  );
  const [eventResults] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${EVENT_TABLE} WHERE organization_id = ?`,
    [organization_id]
  );
  return {
    hasFees: feeResults[0].count > 0,
    hasMemberships: membershipResults[0].count > 0,
    hasCommittees: committeeResults[0].count > 0,
    hasEvents: eventResults[0].count > 0
  };
};

export const deleteOrganizationRecord = async (req, res) => {
    const { organization_id } = req.body;
    
    if (!organization_id) return res.status(400).send("organization_id is required");
    
    try {
        const [existing] = await req.pool.query(`SELECT COUNT(*) AS count FROM ${table} WHERE organization_id = ?`, [organization_id]);
        
        if (existing[0].count === 0) return res.status(404).send("Organization does not exist");

        const { hasFees, hasMemberships, hasCommittees, hasEvents } = await hasDependentRecords(req.pool, organization_id);
        if (hasFees) {
          return res.status(400).send("Cannot delete organization because it has associated fee records");
        }
        if (hasMemberships) {
          return res.status(400).send("Cannot delete organization because it has associated membership records");
        }
        if (hasCommittees) {
          return res.status(400).send("Cannot delete organization because it has associated committee records");
        }
        if (hasEvents) {
          return res.status(400).send("Cannot delete organization because it has associated event records");
        }

        await req.pool.query(`DELETE FROM ${table} WHERE organization_id = ?`, [organization_id]);
        res.status(200).send(`Organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).send("Internal server error");
    }
};