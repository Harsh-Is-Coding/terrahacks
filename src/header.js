import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

const Header = () => {
    return (
        <header className="header">
            <h1 className="header-title">TerraHacks</h1>
            <nav className="header-nav">
                <ul className="header-list">
                    <li className="header-item"><Link to='/'>Home</Link></li>
                    <li className="header-item"><Link to='/EventForm'>EventForm</Link></li>
                    <li className="header-item"><Link to='/TokenManager'>TokenManager</Link></li>
                    <li className="header-item"><Link to='/Login'>Login</Link></li>
                    <li className="header-item"><Link to='/Register'>Register</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;