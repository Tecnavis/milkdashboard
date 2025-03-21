import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AllCustomerHeader from '../components/header/AllCustomerHeader';
import AllCustomerTable from '../components/tables/AllCustomerTable';

const AllCustomer = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                    <AllCustomerHeader onSearch={setSearchQuery} />
                    <div className="panel-body">
                        <AllCustomerTable searchQuery={searchQuery} />
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
};

export default AllCustomer;
