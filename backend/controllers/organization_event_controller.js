// controllers/organization_event_controller.js

const table = process.env.DB_ORGANIZATIONEVENTTABLE || 'ORGANIZATION_EVENT';

// Helper function for error handling
const handleError = (res, error, msg) => {
  console.error(msg, error);
  res.status(500).send('Internal server error');
};

// Helper function to check if event exists
const eventExists = async (pool, event_id) => {
  const [results] = await pool.query(
    `SELECT COUNT(*) AS count FROM ${table} WHERE event_id = ?`,
    [event_id]
  );
  return results[0].count > 0;
};

export const getAllEvents = async (req, res) => {
  try {
    const [results] = await req.pool.query(`
      SELECT oe.*, o.organization_name 
      FROM ${table} oe 
      LEFT JOIN ORGANIZATION o ON oe.organization_id = o.organization_id
    `);
    res.json(results);
  } catch (error) {
    handleError(res, error, 'Error fetching events:');
  }
};

export const getEventsByOrganization = async (req, res) => {
  const { organization_id } = req.params;
  
  try {
    const [results] = await req.pool.query(
      `SELECT * FROM ${table} WHERE organization_id = ?`,
      [organization_id]
    );
    res.json(results);
  } catch (error) {
    handleError(res, error, 'Error fetching events by organization:');
  }
};

export const createEventRecord = async (req, res) => {
  const { organization_id, event_name } = req.body;
  
  if (!organization_id || !event_name) {
    return res.status(400).send(
      'organization_id and event_name are required'
    );
  }
  
  try {
    const [result] = await req.pool.query(
      `INSERT INTO ${table} (organization_id, event_name) VALUES (?, ?)`,
      [organization_id, event_name]
    );
    
    res.status(201).json({ 
      event_id: result.insertId, 
      organization_id, 
      event_name 
    });
  } catch (error) {
    handleError(res, error, 'Error creating event:');
  }
};

export const updateEventRecord = async (req, res) => {
  const { event_id, organization_id, event_name } = req.body;
  
  if (!event_id) {
    return res.status(400).send('event_id is required');
  }
  
  try {
    if (!(await eventExists(req.pool, event_id))) {
      return res.status(404).send('Event does not exist');
    }

    await req.pool.query(
      `UPDATE ${table} SET 
       organization_id = ?, event_name = ? 
       WHERE event_id = ?`,
      [organization_id, event_name, event_id]
    );
    
    res.status(200).json({ event_id, organization_id, event_name });
  } catch (error) {
    handleError(res, error, 'Error updating event:');
  }
};

export const deleteEventRecord = async (req, res) => {
  const { event_id } = req.body;
  
  if (!event_id) {
    return res.status(400).send('event_id is required');
  }
  
  try {
    if (!(await eventExists(req.pool, event_id))) {
      return res.status(404).send('Event does not exist');
    }

    await req.pool.query(`DELETE FROM ${table} WHERE event_id = ?`, [event_id]);
    res.status(200).send(`Event ${event_id} deleted successfully`);
  } catch (error) {
    handleError(res, error, 'Error deleting event:');
  }
};