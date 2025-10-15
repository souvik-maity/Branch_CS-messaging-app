import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MessageList from './components/MessageList';
import Message from './components/Message';
import CustomerForm from './components/CustomerForm';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
            <Link to="/">Agent Dashboard</Link>
            <Link to="/new-message">Customer Message Form</Link>
        </nav>
        <h1>Branch Messaging App</h1>
        <Routes>
          <Route path="/" element={<MessageList />} />
          <Route path="/message/:id" element={<Message />} />
          <Route path="/new-message" element={<CustomerForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
