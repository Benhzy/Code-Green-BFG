import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function EditReceiptItem() {
  const location = useLocation();
  const navigate = useNavigate();
  const [item, setItem] = useState(location.state.item);
  const index = location.pathname.split('/').pop();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prevItem => ({ ...prevItem, [name]: value }));
  };

  const handleSave = () => {
    const updatedItems = location.state.items.map((it, idx) => idx === parseInt(index) ? item : it);
    navigate('/items', { state: { items: updatedItems } });
  };

  return (
    <div>
      <input name="item" value={item.item} onChange={handleChange} />
      <input name="quantity" value={item.quantity} onChange={handleChange} />
      <input name="category" value={item.category} onChange={handleChange} />
      <input name="purchase_date" value={item.purchase_date} onChange={handleChange} />
      <input name="expiry_date" value={item.expiry_date} onChange={handleChange} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default EditReceiptItem;
