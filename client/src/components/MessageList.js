

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
   
    console.log(`Fetching messages with search term: "${searchTerm}"`);

    axios
      .get(`http://localhost:5000/api/messages?searchTerm=${searchTerm}`)
      .then((response) => {
        
        console.log('Received filtered data:', response.data);
        setMessages(response.data);
      })
      .catch((error) => console.error('Error fetching messages!', error));
  }, [searchTerm]); 

  
  useEffect(() => {
    const handleUpdate = () => {
        axios
        .get(`http://localhost:5000/api/messages?searchTerm=${searchTerm}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error('Error refetching after update!', error));
    };

    socket.on('newMessage', handleUpdate);
    socket.on('messageUpdated', handleUpdate);

   
    return () => {
      socket.off('newMessage', handleUpdate);
      socket.off('messageUpdated', handleUpdate);
    };
  }, [searchTerm]); 

  const getStatusClass = (status) => {
    if (status === 'assigned') return 'status-assigned';
    if (status === 'resolved') return 'status-resolved';
    return 'status-unassigned';
  };

  return (
    <div>
      <h2>Customer Messages</h2>
      <input
        type="text"
        placeholder="Search messages by keyword (e.g., loan, payment)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      <div className="message-list">
        {messages.map((message) => (
          <Link to={`/message/${message.id}`} key={message.id} className="message-item-link">
            <div className={`message-item ${message.urgent ? 'urgent' : ''}`}>
              <p><strong>User {message.user_id}</strong></p>
              <p>{message.message_body.substring(0, 100)}...</p>
              <div className="message-footer">
                <small>{new Date(message.timestamp).toLocaleString()}</small>
                <span className={`status-badge ${getStatusClass(message.status)}`}>{message.status}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MessageList;