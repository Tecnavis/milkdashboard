import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { allCustomerData } from '../../data/Data';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import { FetchCustomer ,deleteCustomer} from '../../Helper/handle-api';

const AllCustomerTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = allCustomerData
     // Pagination logic
     const indexOfLastData = currentPage * dataPerPage;
     const indexOfFirstData = indexOfLastData - dataPerPage;
     const currentData = dataList.slice(indexOfFirstData, indexOfLastData);
   
     const paginate = (pageNumber) => {
       setCurrentPage(pageNumber);
     };
   
     // Calculate total number of pages
     const totalPages = Math.ceil(dataList.length / dataPerPage);
     const pageNumbers = [];
     for (let i = 1; i <= totalPages; i++) {
       pageNumbers.push(i);
     }
   

     //get all Customers
     const [customers, setCustomers] = useState([]);
     useEffect(() => {
       const fetchCustomers = async () => {
         const response = await FetchCustomer();
         setCustomers(response);
       };
       fetchCustomers();
     })
  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                  />
                </div>
              </th>
              <th>Customer Id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Location </th>
              <th>Address</th>
              <th>Route No </th>
              <th>Route Name </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((data) => (
              <tr key={data.userName}>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                <td>{data.customerId}</td>
                <td>
                  <Link to="#">{data.name}</Link>
                </td>
                <td>{data.phone}</td>
                
                <td>{data.address} </td>
                <td>
  <a 
    href={`https://www.google.com/maps?q=${data.location}`} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    Location
  </a>
</td>

                <td>{data.routeno}</td>
                <td>{data.routename} </td>
                <td>   <div className='btn-box'> <button><i className="fa-light fa-pen"></i></button>
                            <button><i className="fa-light fa-trash" onClick={() => deleteCustomer(data._id)}></i></button>
                        </div>
                        </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
    </>
  );
}

export default AllCustomerTable