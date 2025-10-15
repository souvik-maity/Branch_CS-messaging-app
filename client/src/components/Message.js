import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CannedMessages from './CannedMessages';

// This function gets or creates a unique ID for the current agent's session.
const getAgentId = () => {
  let agentId = sessionStorage.getItem('agentId');
  if (!agentId) {
    agentId = Math.floor(Math.random() * 1000) + 1; // Simple random ID
    sessionStorage.setItem('agentId', agentId);
  }
  return Number(agentId);
};


function Message() {
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [agentId] = useState(getAgentId()); // <-- Use the unique agent ID

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/messages/${id}`)
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('Error fetching the message!', error);
      });
  }, [id]);

  const handleAssign = () => {
    // When assigning, we send the unique agentId to the backend.
    axios.post(`http://localhost:5000/api/messages/${id}/assign`, { agentId })
        .then(() => {
            alert(`Message assigned to you (Agent ID: ${agentId})`);
            navigate('/');
        })
        .catch(error => console.error('Error assigning message', error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:5000/api/messages/${id}/reply`, { agent_reply: reply })
      .then(() => {
        alert('Reply sent!');
        navigate('/');
      })
      .catch((error) => console.error('Error sending reply!', error));
  };

  if (!message) return <div>Loading...</div>;

  // This is the corrected logic.
  // The reply form will ONLY show if the message is assigned AND the assigned_agent_id in the database
  // matches the unique agentId of the agent viewing the page.
  const isAssignedToCurrentUser = message.status === 'assigned' && message.assigned_agent_id === agentId;

  return (
    <div>
      <div className="message-detail">
        <h3>Message from User {message.user_id}</h3>
        <p>Your Agent ID is: <strong>{agentId}</strong></p>
        <p>{message.message_body}</p>
        <small>{new Date(message.timestamp).toLocaleString()}</small>
        {message.agent_reply && <div className="agent-reply"><strong>Reply Sent:</strong><p>{message.agent_reply}</p></div>}
      </div>

      {/* Show "Assign" button only if the message is unassigned */}
      {message.status === 'unassigned' && <button onClick={handleAssign}>Assign to Me</button>}

      {/* Show reply form ONLY if the message is assigned to the current user */}
      {isAssignedToCurrentUser && (
        <>
          <CannedMessages onSelectMessage={setReply} />
          <form onSubmit={handleSubmit}>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
            ></textarea>
            <button type="submit">Send Reply & Resolve</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Message;