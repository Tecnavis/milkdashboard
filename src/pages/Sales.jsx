import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AllCustomerTable from '../components/tables/customerpayment';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Collection from '../components/dashboard/Collection';

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <div className="panel-header">
              <h5>Sales</h5>
              <div className="btn-box d-flex gap-2"> 
              </div>
            </div>
            <div className="panel-body">
                 <Collection />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

