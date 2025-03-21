import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';
import { Link } from 'react-router-dom';

const AllProductHeader = ({ setSearchQuery }) => {
    const { headerBtnOpen, handleHeaderBtn, handleHeaderReset, headerRef } = useContext(DigiContext);
    const [search, setSearch] = useState('');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setSearchQuery(value);
    };

    return (
        <div className="panel-header">
            <h5>All Products</h5>
            <div className="btn-box d-flex flex-wrap gap-2">
                <div id="tableSearch">
                    <Form.Control
                        type="text"
                        placeholder="Search by category or title..."
                        value={search}
                        onChange={handleSearchChange}
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
