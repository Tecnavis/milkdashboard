import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SalesordersHeader = ({ onSearch }) => {

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Pass search value to parent component
  };

  return (
    <div className="panel-header">
      <h5>Order Product</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
        <Form.Control 
              type='text' 
              placeholder='Search ...' 
              value={searchQuery} 
              onChange={handleSearch} 
            />
        </div>
      </div>
    </div>
  );
};

export default SalesordersHeader;
