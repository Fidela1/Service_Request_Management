const pool = require('../../db');

const createRequest = async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user.id;

  try {
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const query = `
      INSERT INTO requests(user_id, title, description)
      VALUES($1, $2, $3)
      RETURNING *`;
    const values = [user_id, title, description];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Request created successfully',
      request: result.rows[0],
    });

  } catch (error) {
    console.error('❌ Error creating request:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM requests ORDER BY created_at DESC');
    res.status(200).json({
      message: 'Requests retrieved successfully',
      requests: result.rows,
    });
  } catch (error) {
    console.error('❌ Error retrieving requests:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const getRequestById = async (req, res) => {
    const requestId = req.params.id;
    const userId = req.user.id;
    
    try {
        const result = await pool.query('SELECT * FROM requests WHERE id = $1 AND user_id = $2', [requestId,userId]);
    
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Request not found or not yours' });
        }
    
        res.status(200).json({
        message: 'Request retrieved successfully',
        request: result.rows[0],
        });
    } catch (error) {
        console.error('❌ Error retrieving request:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
    }

    const updateRequestById  = async (req, res) =>{
        const requestId = req.params.id;
        const userId = req.user.id;

        const {title, description} = req.body;
        try{
        const result = await pool.query('UPDATE requests SET title = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *', 
            [title, description, requestId,userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found or not yours' });

        }
        res.status(200).json({
            message: 'Request updated successfully',
            request: result.rows[0],
        });
        }catch(error) {
            console.error('❌ Error updating request:', error.message);
            res.status(500).json({ error: 'Server error' });
        }
    }
    const updateRequestStatus = async (req, res) => {
  const requestId = req.params.id;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    const result = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      message: 'Request status updated successfully',
      request: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}
const deleteRequestById = async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    // First, get the request and check who owns it
    const existing = await pool.query(
      'SELECT * FROM requests WHERE id = $1',
      [requestId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const requestOwnerId = existing.rows[0].user_id;

    // Allow if user is admin OR owner
    if (userRole !== 'admin' && requestOwnerId !== userId) {
      return res.status(403).json({ error: 'Unauthorized: Not allowed to delete this request' });
    }

    await pool.query('DELETE FROM requests WHERE id = $1', [requestId]);

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting request:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};



module.exports = {
  createRequest,
    getAllRequests,
    getRequestById,
    updateRequestById,
    deleteRequestById,
    updateRequestStatus

};
