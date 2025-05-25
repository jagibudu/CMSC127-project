import express from "express";

const router = express.Router();

// Get all organization committees
router.get("/", async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_ORGANIZATIONCOMMITTEETABLE}`);
        res.json(results);
    } catch (error) {
        console.error("Error fetching organization committees:", error);
        res.status(500).send("Internal server error");
    }
    });

    // Get committees by organization_id
    router.get("/:organization_id", async (req, res) => {
    const { organization_id } = req.params;
    
    try {
        const [results] = await req.pool.query(
        `SELECT * FROM ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} WHERE organization_id = ?`,
        [organization_id]
        );
        res.json(results);
    } catch (error) {
        console.error("Error fetching committees by organization:", error);
        res.status(500).send("Internal server error");
    }
    });

    // Insert a new organization committee
    router.post("/", async (req, res) => {
    const { organization_id, committee_name } = req.body;

    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }

    try {
        const [result] = await req.pool.query(
        `INSERT INTO ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} (organization_id, committee_name) VALUES (?, ?)`,
        [organization_id, committee_name]
        );

        res.status(201).json({
        committee_id: result.insertId,
        organization_id,
        committee_name
        });
    } catch (error) {
        console.error("Error inserting organization committee:", error);
        res.status(500).send("Internal server error");
    }
    });

    // Update organization committee
    router.put("/", async (req, res) => {
    const { committee_id, organization_id, committee_name } = req.body;

    if (!committee_id) {
        return res.status(400).send("committee_id is required");
    }

    try {
        const [checkResults] = await req.pool.query(
        `SELECT COUNT(*) AS count FROM ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} WHERE committee_id = ?`,
        [committee_id]
        );

        if (checkResults[0].count === 0) {
        return res.status(404).send("Committee does not exist");
        }

        await req.pool.query(
        `UPDATE ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} SET organization_id = ?, committee_name = ? WHERE committee_id = ?`,
        [organization_id, committee_name, committee_id]
        );

        res.status(200).json({
        committee_id,
        organization_id,
        committee_name
        });
    } catch (error) {
        console.error("Error updating organization committee:", error);
        res.status(500).send("Internal server error");
    }
    });

    // Delete organization committee
    router.delete("/", async (req, res) => {
    const { committee_id } = req.body;

    if (!committee_id) {
        return res.status(400).send("committee_id is required");
    }

    try {
        const [checkResults] = await req.pool.query(
        `SELECT COUNT(*) AS count FROM ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} WHERE committee_id = ?`,
        [committee_id]
        );

        if (checkResults[0].count === 0) {
        return res.status(404).send("Committee does not exist");
        }

        await req.pool.query(
        `DELETE FROM ${process.env.DB_ORGANIZATIONCOMMITTEETABLE} WHERE committee_id = ?`,
        [committee_id]
        );

        res.status(200).send(`Committee ${committee_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization committee:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;