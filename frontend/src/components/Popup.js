import React from 'react';
import './Popup.css';

const Popup = ({ message, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default Popup;