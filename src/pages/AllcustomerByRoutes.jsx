import React from 'react'
import Footer from '../components/footer/Footer'
import AllCustomerTable from '../components/tables/AllcustomerbyRoutes'
import { Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const AllCustomer = () => {
  return (
    <div className="main-content">
        <div className="row">
            <div className="col-12">
                <div className="panel">
                <div className="panel-header">
        <h5>All Customer By Routes</h5>
        <div className="btn-box d-flex gap-2">
          <div className="btn-box d-flex gap-2"><button className="btn btn-sm btn-primary"><Link to="/addEmployee" style={{color:'white'}}><i className="fa-light fa-plus"></i> Customer Create</Link></button></div>
            <div id="tableSearch">
                <Form.Control type='text' placeholder='Seach...'/>
                
            </div>  
        </div>
    </div>
                    <div className="panel-body">
                        <AllCustomerTable/>
                    </div>
                </div>
            </div>
        </div>

        <Footer/>
    </div>
  )
}

export default AllCustomer