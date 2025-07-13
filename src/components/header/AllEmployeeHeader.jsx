import React from 'react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AllEmployeeHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="panel-header">
      <h5>All Employee</h5>
      <div className="btn-box d-flex flex-wrap gap-2">
        <div id="tableSearch">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link to="/registration" className="btn btn-sm btn-primary">
          <i className="fa-light fa-plus"></i> Add New
        </Link>
      </div>
    </div>
  );
};

export default AllEmployeeHeader;
