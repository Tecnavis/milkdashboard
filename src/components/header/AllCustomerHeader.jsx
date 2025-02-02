import React, { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import { DigiContext } from '../../context/DigiContext';
import { Link } from 'react-router-dom';

const AllCustomerHeader = () => {
    
  return (
    <div className="panel-header">
        <h5>All Customer</h5>
        <div className="btn-box d-flex gap-2">
          <div className="btn-box d-flex gap-2"><button className="btn btn-sm btn-primary"><Link to="/addEmployee" style={{color:'white'}}><i className="fa-light fa-plus"></i> Customer Create</Link></button></div>
            <div id="tableSearch">
                <Form.Control type='text' placeholder='Seach...'/>
                
            </div>  
        </div>
    </div>
  )
}

export default AllCustomerHeader