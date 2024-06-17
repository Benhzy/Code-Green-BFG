import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from './IpAdr'; 

function ItemsList({ userId }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState(location.state.items);

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    navigate(`/edit/${index}`, { state: { item: items[index],items } });
  };

  const handleConfirm = async () => {
    await axios.post(`${apiUrl}/upload_items/${userId}`, { items });
    // Handle confirmation success (e.g., navigate to a success page or show a message)
    navigate('/groceries')
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item.item} - {item.quantity}</span>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}

export default ItemsList;

