import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FetchCustomer } from '../../Helper/handle-api';

const Invoices = () => {
    const [allCustomers, setAllCustomers] = useState([]);

    useEffect(() => {
        FetchCustomer().then((res) => {
            setAllCustomers(res);
        });
    }, []);

    return (
        <div className="panel">
            <div className="panel-header">
                <h5>Recent Customers</h5>
                <Link className="btn btn-sm btn-primary" to="/allCustomer">View All</Link>
            </div>
            <div className="panel-body p-0">
                <div className="table-responsive">
                    <table className="table invoice-table table-hover">
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Contact</th>
                                <th>Route No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allCustomers.slice(-10).reverse().map((customer, index) => (
                                <tr key={index}>
                                    <td>{customer.customerId}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.phone}<br/>{customer.email}</td>
                                    <td>{customer.routeno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Invoices;
