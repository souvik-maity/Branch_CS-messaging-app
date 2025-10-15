const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get messages with search
app.get('/api/messages', (req, res) => {
  const { searchTerm } = req.query;
  let query = 'SELECT * FROM messages';
  const params = [];

  if (searchTerm) {
    query += ' WHERE message_body LIKE ?';
    params.push(`%${searchTerm}%`);
  }

  query += ' ORDER BY urgent DESC, timestamp DESC';

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get canned messages
app.get('/api/canned-messages', (req, res) => {
  connection.query('SELECT * FROM canned_messages', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Assign a message
app.post('/api/messages/:id/assign', (req, res) => {
    const { id } = req.params;
    const { agentId } = req.body;
    const query = "UPDATE messages SET status = 'assigned', assigned_agent_id = ? WHERE id = ?";
    connection.query(query, [agentId, id], (err) => {
        if (err) return res.status(500).send(err);
        io.emit('messageUpdated');
        res.sendStatus(200);
    });
});

// Reply to a message and mark as resolved
app.post('/api/messages/:id/reply', (req, res) => {
  const { id } = req.params;
  const { agent_reply } = req.body;
  const query = "UPDATE messages SET agent_reply = ?, status = 'resolved' WHERE id = ?";
  connection.query(query, [agent_reply, id], (err) => {
    if (err) return res.status(500).send(err);
    io.emit('messageUpdated');
    res.sendStatus(200);
  });
});

// Get a single message
app.get('/api/messages/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM messages WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// Simulate a new customer message
app.post('/api/messages', (req, res) => {
  const { userId, messageBody } = req.body;
  const urgentKeywords = ['loan', 'disbursed', 'approval', 'rejected', 'payment', 'sent'];
  const isUrgent = urgentKeywords.some(keyword => messageBody.toLowerCase().includes(keyword));
  const query =
    'INSERT INTO messages (user_id, message_body, timestamp, urgent) VALUES (?, ?, NOW(), ?)';
  connection.query(query, [userId, messageBody, isUrgent], (err) => {
    if (err) return res.status(500).send(err);
    io.emit('newMessage');
    res.sendStatus(201);
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));