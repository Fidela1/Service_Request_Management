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
    const result = await pool.query('SELECT * FROM requests');
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
    
    try {
        const result = await pool.query('SELECT * FROM requests WHERE id = $1', [requestId]);
    
        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Request not found' });
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

        const {title, description} = req.body;
        try{
        const result = await pool.query('UPDATE requests SET title = $1, description = $2 WHERE id = $3 RETURNING *', 
            [title, description, requestId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Request not found' });

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
const deleteRequestById = async (req,res) => {
  const requestId = req.params.id;
  try{
      const result = await pool.query('DELETE FROM requests WHERE id = $1 RETURNING *', [requestId]);
      if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Request not found' });
      }
      res.status(200).json({
          message: 'Request deleted successfully',
      });
  }
  catch(error){
    console.error("❌Error Deleting request:", error.message);
    res.status(500).json({error: "Server error"});
  }
}
module.exports = {
  createRequest,
    getAllRequests,
    getRequestById,
    updateRequestById,
    deleteRequestById

};
