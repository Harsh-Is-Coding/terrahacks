import React, {useEffect}from 'react';
import { Link } from 'react-router-dom';
import './index.css'
import logo from './logo.png';

const Header = () => {
    let isOrganizer = false;
    useEffect(() => {
         isOrganizer = localStorage.getItem('isOrganizer');
    }, []);
    return (
        <header className="header">
            <img src={logo} alt='logo' className="header-logo"/>
            <h1 className="header-title">EcoHub</h1>
            <nav className="header-nav">
                <ul className="header-list">
                    <li className="header-item"><Link to='/' >Home</Link></li>
                    {!isOrganizer && (<li className="header-item"><Link to='/EventForm'>EventForm</Link></li>)}
                    <li className="header-item"><Link to='/TokenManager'>TokenManager</Link></li>
                    <li className="header-item"><Link to='/Login'>Login</Link></li>
                    <li className="header-item"><Link to='/Register'>Register</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;