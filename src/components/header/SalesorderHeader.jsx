import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const SalesordersHeader = ({ setSearchTerm }) => {
  return (
    <div className="panel-header">
      <h5>Order Product</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
          <Form.Control
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesordersHeader;
