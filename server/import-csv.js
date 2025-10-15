const fs = require('fs');
const mysql = require('mysql2');
const csv = require('csv-parser');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const urgentKeywords = ['loan', 'disbursed', 'approval', 'rejected', 'payment', 'sent'];

const isUrgent = (message) => {
  const lowerCaseMessage = message.toLowerCase();
  return urgentKeywords.some(keyword => lowerCaseMessage.includes(keyword));
};

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database.');
});

const results = [];
fs.createReadStream('../GeneralistRails_Project_MessageData.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const query =
      'INSERT INTO messages (user_id, timestamp, message_body, urgent) VALUES ?';
    const values = results.map((row) => [
      row['User ID'],
      row['Timestamp (UTC)'],
      row['Message Body'],
      isUrgent(row['Message Body']),
    ]);
    connection.query(query, [values], (err, res) => {
      if (err) throw err;
      console.log(`Inserted ${res.affectedRows} rows.`);
      connection.end();
    });
  });