import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AllCustomerAmountTable from '../components/tables/AllCustomerAmountsRoutes';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AllCustomerAmount = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Customer Payment Amount</h5>
              <div className="btn-box d-flex gap-2">
                <button className="btn btn-sm btn-primary">
                  <Link to="/addEmployee" style={{ color: 'white' }}>
                    <i className="fa-light fa-plus"></i> Customer Create
                  </Link>
                </button>
                <div id="tableSearch">
                  <Form.Control
                    type="text"
                    placeholder="Search route..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="panel-body">
              <AllCustomerAmountTable searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllCustomerAmount;
