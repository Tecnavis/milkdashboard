import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { categoryData } from '../../data/Data';
import { Link } from 'react-router-dom';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';

const CategoryTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = categoryData
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
        <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped" id="allProductTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentData.map((data)=>(
                    <tr key={data.id}>
                        <td>
                            <div className="table-category-card">
                                <div className="part-icon">
                                    <span><img src={data.image} alt="image"/></span>
                                </div>
                            </div>
                        </td>
                        <td>{data.slug}</td>
                        <td>
                            <div className="btn-box">
                                <button><i className="fa-light fa-pen-to-square"></i></button>
                                <button><i className="fa-light fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </Table>
    </OverlayScrollbarsComponent>
    <PaginationSection currentPage={currentPage} totalPages={totalPages} paginate={paginate} pageNumbers={pageNumbers}/>     
    </>
  )
}

export default CategoryTable