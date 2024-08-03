import React from 'react';
import './index.css'

const Header = () => {
    return (
        <header className="header">
            <h1 className="header-title">TerraHacks</h1>
            <nav className="header-nav">
                <ul className="header-list">
                    <li className="header-item">Home</li>
                    <li className="header-item">Profile</li>
                    <li className="header-item">Login</li>
                    <li className="header-item">SignUp</li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;