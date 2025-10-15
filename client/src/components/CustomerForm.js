import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CustomerForm() {
  const [userId, setUserId] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    // This prevents the browser from reloading the page
    e.preventDefault();

    // SPY #1: Check if this function is being called at all.
    console.log('handleSubmit function was called!');

    // SPY #2: Check the values right before sending.
    console.log('Data to be sent:', { userId, messageBody });

    // A simple check to make sure the fields are not empty
    if (!userId.trim() || !messageBody.trim()) {
      alert('Please fill out both the User ID and Message fields.');
      return; // Stop the function if fields are empty
    }

    axios
      .post('http://localhost:5000/api/messages', { userId, messageBody })
      .then(() => {
        alert('Message sent successfully!');
        navigate('/');
      })
      .catch((error) => {
        // SPY #3: This will show any error from the server.
        console.error('There was an error sending the message:', error);
        alert('Failed to send message. Check the console for details.');
      });
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>Send a New Message</h2>
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
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
}

export default CustomerForm;