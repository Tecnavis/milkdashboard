// AllEmployeeMainContent.jsx
import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AllEmployeeHeader from '../components/header/AllEmployeeHeader';
import AllEmployeeTable from '../components/tables/AllEmployeeTable';

const AllEmployeeMainContent = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="main-content">
      <div className="row">
        <div className="col-12">
          <div className="panel">
            <AllEmployeeHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="panel-body">
              <AllEmployeeTable searchTerm={searchTerm} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AllEmployeeMainContent;
