import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import SalesordersHeader from '../components/header/SalesorderHeader';
import SalesorderTable from '../components/tables/Salesorder';

const Salesorders = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="main-content">
      <div className="row g-4">
        <div className="col-12">
          <div className="panel">
            <SalesordersHeader setSearchTerm={setSearchTerm} />
            <div className="panel-body">
              <SalesorderTable searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Salesorders;
