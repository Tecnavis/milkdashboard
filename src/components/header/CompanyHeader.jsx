// CompanyHeader.jsx
import React from 'react';
import { Form } from 'react-bootstrap';

const CompanyHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="panel-header">
      <h5>Warehouse</h5>
      <div className="btn-box d-flex gap-2">
        <div id="tableSearch">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
