// client/src/components/MessageList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function MessageList() {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // This useEffect hook is now dedicated to fetching messages.
  // It runs ONCE on load, and then AGAIN every time the 'searchTerm' changes.
  useEffect(() => {
    // SPY LOG #1: See the search term being used.
    console.log(`Fetching messages with search term: "${searchTerm}"`);

    axios
      .get(`http://localhost:5000/api/messages?searchTerm=${searchTerm}`)
      .then((response) => {
        // SPY LOG #2: See the filtered data received from the backend.
        console.log('Received filtered data:', response.data);
        setMessages(response.data);
      })
      .catch((error) => console.error('Error fetching messages!', error));
  }, [searchTerm]); // <-- This dependency is the crucial fix!

  // This useEffect hook handles the real-time socket updates.
  useEffect(() => {
    const handleUpdate = () => {
      // When a real-time update occurs, refetch with the CURRENT search term.
      axios
        .get(`http://localhost:5000/api/messages?searchTerm=${searchTerm}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error('Error refetching after update!', error));
    };

    socket.on('newMessage', handleUpdate);
    socket.on('messageUpdated', handleUpdate);

    // Clean up the listeners when the component is no longer on screen.
    return () => {
      socket.off('newMessage', handleUpdate);
      socket.off('messageUpdated', handleUpdate);
    };
  }, [searchTerm]); // Also depends on searchTerm to refetch correctly.

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