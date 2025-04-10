import React, { useState } from 'react';
import Footer from '../components/footer/Footer';
import AllProductHeader from '../components/header/AllProductHeader';
import AllProductTable from '../components/tables/AllProductTable';

const AllProductMainContent = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="main-content">
            <div className="row g-4">
                <div className="col-12">
                    <div className="panel">
                        <AllProductHeader  onSearch={setSearchQuery} />
                        <div className="panel-body">
                            <AllProductTable  searchQuery ={searchQuery} />
                           
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllProductMainContent;
