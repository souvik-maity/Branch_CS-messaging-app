import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CannedMessages({ onSelectMessage }) {
  const [cannedMessages, setCannedMessages] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/canned-messages')
      .then((response) => {
        setCannedMessages(response.data);
      })
      .catch((error) => console.error('Error fetching canned messages!', error));
  }, []);

  return (
    <div className="canned-messages">
      <h4>Canned Responses</h4>
      {cannedMessages.map((msg) => (
        <button key={msg.id} onClick={() => onSelectMessage(msg.message)}>
          {msg.title}
        </button>
      ))}
    </div>
  );
}

export default CannedMessages;