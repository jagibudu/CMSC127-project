import express from "express";
const router = express.Router();

// Get all organizations
router.get("/", async (req, res) => {
    try {
        const [results] = await req.pool.query(`SELECT * FROM ${process.env.DB_ORGANIZATIONTABLE}`);
        res.json(results);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).send("Internal server error");
    }
});

// Insert a new organization
router.post("/", async (req, res) => {
    const { organization_id, organization_name } = req.body;

    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_ORGANIZATIONTABLE} WHERE organization_id = ?`,
            [organization_id]
        );

        if (checkResults[0].count > 0) {
            return res.status(409).send("Organization already exists");
        }

        await req.pool.query(
            `INSERT INTO ${process.env.DB_ORGANIZATIONTABLE} (organization_id, organization_name) VALUES (?, ?)`,
            [organization_id, organization_name]
        );

        res.status(201).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error inserting organization:", error);
        res.status(500).send("Internal server error");
    }
});

// Update organization name
router.put("/", async (req, res) => {
    const { organization_id, organization_name } = req.body;

    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_ORGANIZATIONTABLE} WHERE organization_id = ?`,
            [organization_id]
        );

        if (checkResults[0].count === 0) {
            return res.status(404).send("Organization does not exist");
        }

        await req.pool.query(
            `UPDATE ${process.env.DB_ORGANIZATIONTABLE} SET organization_name = ? WHERE organization_id = ?`,
            [organization_name, organization_id]
        );

        res.status(200).json({ organization_id, organization_name });
    } catch (error) {
        console.error("Error updating organization:", error);
        res.status(500).send("Internal server error");
    }
});

// Delete organization
router.delete("/", async (req, res) => {
    const { organization_id } = req.body;

    if (!organization_id) {
        return res.status(400).send("organization_id is required");
    }

    try {
        const [checkResults] = await req.pool.query(
            `SELECT COUNT(*) AS count FROM ${process.env.DB_ORGANIZATIONTABLE} WHERE organization_id = ?`,
            [organization_id]
        );

        if (checkResults[0].count === 0) {
            return res.status(404).send("Organization does not exist");
        }

        await req.pool.query(
            `DELETE FROM ${process.env.DB_ORGANIZATIONTABLE} WHERE organization_id = ?`,
            [organization_id]
        );

        res.status(200).send(`Organization ${organization_id} deleted successfully`);
    } catch (error) {
        console.error("Error deleting organization:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;
