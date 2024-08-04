import './index.css'
import Header from './header.js';
import Home from './home.js';
import EventForm from './EventForm.js';
import Login from './Login.js';
import TokenManager from './TokenManager.js';
import Register from './Register.js';
import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
      <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/EventForm" element={<EventForm />} />
          <Route path="/TokenManager" element={<TokenManager />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
