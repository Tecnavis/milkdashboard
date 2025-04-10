import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';
import { Link } from 'react-router-dom';

const AllProductHeader = ({ onSearch }) => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
    const [searchQuery, setSearchQuery] = useState('');


    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value); // Pass search value to parent component
      };

    return (
        <div className="panel-header">
            <h5>All Products</h5>
            <div className="btn-box d-flex flex-wrap gap-2">
                <div id="tableSearch">
                <Form.Control 
              type='text' 
              placeholder='Search ...' 
              value={searchQuery} 
              onChange={handleSearch} 
            />
                </div>
                <div className="btn-box">
                    <Link to="/addNewProduct" className="btn btn-sm btn-primary">
                        <i className="fa-light fa-plus"></i> Add New
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AllProductHeader;
