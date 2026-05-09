const pool = require('../db/pool');

// Get all complaints for the logged-in user
const getMyComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    
    let queryStr = `
      SELECT c.*, cat.name as category_name, cat.icon as category_icon,
             l.area, l.city
      FROM complaints c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN locations l ON c.location_id = l.location_id
      WHERE c.user_id = $1
    `;
    const params = [req.user.userId];
    let paramIndex = 2;

    if (status) {
      queryStr += ` AND c.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (category) {
      queryStr += ` AND c.category_id = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    queryStr += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(queryStr, params);
    
    res.json({ complaints: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving complaints.' });
  }
};

// Get a single complaint detail
const getComplaintDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, cat.name as category_name, cat.icon as category_icon,
             l.area, l.street, l.city, l.pincode, l.latitude, l.longitude
      FROM complaints c
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN locations l ON c.location_id = l.location_id
      WHERE c.complaint_id = $1 AND c.user_id = $2
    `, [id, req.user.userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Complaint not found or access denied.' });
    }

    // Get logs for timeline
    const logsResult = await pool.query(`
      SELECT sl.*, u.full_name as changed_by_name, u.role
      FROM status_logs sl
      LEFT JOIN users u ON sl.changed_by = u.user_id
      WHERE sl.complaint_id = $1
      ORDER BY sl.changed_at ASC
    `, [id]);

    res.json({ 
      complaint: result.rows[0],
      timeline: logsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving complaint.' });
  }
};

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;
    let location;
    try {
       location = JSON.parse(req.body.location);
    } catch(e) {
       location = {};
    }

    let image_url = null;
    if (req.file) {
      // Construct public URL for image
      image_url = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`;
    }
    
    // First insert location
    let locationId = null;
    if (location && location.latitude && location.longitude) {
      const locResult = await pool.query(`
        INSERT INTO locations (area, street, city, pincode, latitude, longitude)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING location_id
      `, [location.area, location.street, location.city, location.pincode, location.latitude, location.longitude]);
      locationId = locResult.rows[0].location_id;
    }

    // Insert complaint
    const complaintResult = await pool.query(`
      INSERT INTO complaints (user_id, category_id, location_id, title, description, image_url, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *
    `, [req.user.userId, category_id, locationId, title, description, image_url]);

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: complaintResult.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating complaint.' });
  }
};

// Get all categories (Public/Auth)
const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json({ categories: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error retrieving categories.' });
  }
};

module.exports = { getMyComplaints, getComplaintDetail, createComplaint, getCategories };
