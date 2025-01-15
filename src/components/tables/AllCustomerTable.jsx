import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { allCustomerData } from '../../data/Data';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';

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
              <th>Email</th>
              <th>Address</th>
              <th>Location </th>
              <th>Route No </th>
              <th>Route Name </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((data) => (
              <tr key={data.userName}>
                <td>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                </td>
                <td>100</td>
                <td>
                  <Link to="#">{data.name}</Link>
                </td>
                <td>98765432</td>
                <td>narji@gmail.com</td>
                <td>
                  <Link to="#">Address</Link>
                </td>
                <td>Kuttiady,location </td>

                <td>Route No 1 </td>
                <td>Route Kuttiady </td>
                <td>   <div className='btn-box'> <button><i className="fa-light fa-pen"></i></button>
                            <button><i className="fa-light fa-trash"></i></button>
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