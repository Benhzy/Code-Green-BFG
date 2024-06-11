import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import './BottomMenuBar.css';

const BottomMenuBar = ({ fetchInventoryItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const navigate = useNavigate();

    const toggleButtons = () => {
        setIsOpen(!isOpen);
    };

    const openForm = () => {
        setIsFormOpen(true);
        setIsOpen(false); // Close the floating buttons when form is opened
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const handleScanReceiptClick = () => {
        navigate('/scanner'); // Redirect to the camera page
    };

    return (
        <div className="bottom-menu-bar">
            <Link to="/groceries" className="menu-button">Grocery</Link>
            <button className="menu-button middle-button" onClick={toggleButtons}>+</button>
            <Link to="/recipes" className="menu-button">Recipe</Link>

            {isOpen && (
                <div className="floating-buttons">
                    <button className="floating-button-item" onClick={openForm}>Add item</button>
                    <button className="floating-button-item" onClick={handleScanReceiptClick}>Scan receipt</button>
                </div>
            )}

            {isFormOpen && <AddItemForm onClose={closeForm} fetchInventoryItems={fetchInventoryItems} />}
        </div>
    );
};

export default BottomMenuBar;
