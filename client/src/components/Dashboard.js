// client/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

// Establish the socket connection once
const socket = io('http://localhost:5000');

function Dashboard() {
  // State for the list of messages
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // State for the new message form
  const [userId, setUserId] = useState('');
  const [messageBody, setMessageBody] = useState('');

  // Function to fetch messages from the server
  const fetchMessages = (term = '') => {
    axios
      .get(`http://localhost:5000/api/messages?searchTerm=${term}`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.error('Error fetching messages!', error));
  };

  // Effect to load messages and listen for real-time updates
  useEffect(() => {
    fetchMessages(); // Fetch initial messages
    socket.on('newMessage', () => fetchMessages(searchTerm));
    socket.on('messageUpdated', () => fetchMessages(searchTerm));

    // Cleanup listeners when the component unmounts
    return () => {
      socket.off('newMessage');
      socket.off('messageUpdated');
    };
  }, [searchTerm]);

  // Function to handle the new message form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with:', { userId, messageBody });

    if (!userId.trim() || !messageBody.trim()) {
      alert('Please fill out both User ID and Message fields.');
      return;
    }

    axios
      .post('http://localhost:5000/api/messages', { userId, messageBody })
      .then(() => {
        alert('Message sent successfully!');
        // Clear the form fields after successful submission
        setUserId('');
        setMessageBody('');
        // No need to navigate, the list will update automatically via sockets
      })
      .catch((error) => {
        console.error('Error sending message:', error);
        alert('Failed to send message. Check the browser console for details.');
      });
  };

  const getStatusClass = (status) => {
    if (status === 'assigned') return 'status-assigned';
    if (status === 'resolved') return 'status-resolved';
    return 'status-unassigned';
  };

  return (
    <div>
      {/* === NEW MESSAGE FORM === */}
      <div className="form-container">
        <form onSubmit={handleFormSubmit} className="customer-form">
          <h2>Send a New Message (Test Form)</h2>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
          />
          <textarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Your message"
          />
          <button type="submit">Send Message</button>
        </form>
      </div>

      <hr style={{ margin: '40px 0' }} />

      {/* === MESSAGE LIST === */}
      <h2>Customer Messages</h2>
      <input
        type="text"
        placeholder="Search messages..."
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

export default Dashboard;