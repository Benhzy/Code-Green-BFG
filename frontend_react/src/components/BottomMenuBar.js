// BottomMenuBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './BottomMenuBar.css';

const BottomMenuBar = () => {
    return (
        <div className="bottom-menu-bar">
            <Link to="/groceries" className="menu-button">Groceries</Link>
            <Link to="/add" className="menu-button">+</Link>
            <Link to="/recipes" className="menu-button">Recipes</Link>
        </div>
    );
};

export default BottomMenuBar;
