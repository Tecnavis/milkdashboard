import React, { useState } from 'react'
import { Table } from 'react-bootstrap'
import { allProductData } from '../../data/Data';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';

const AllProductTable = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);
    const dataList = allProductData
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
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Litter</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {currentData.map((data)=>(
                <tr >
                    <td>
                        <div className="table-product-card">
                            <div className="part-img">
                                <img src={data.image} alt={data.product_name}/>
                            </div>
                            <div className="part-txt">
                                <span className="product-name">{data.product_name}</span>
                                <span className="product-category">Category: {data.category}</span>
                            </div>
                        </div>
                    </td>
                   
                    <td><span className="table-dscr">zdsxfcgvhbjklmjnbhgvf fcgtswvbhyioxdeguy xdcfsghvybzuj</span></td>
                    <td>700</td>
                    <td>10%</td>
                    <td>100g</td>
                    <td>
                        <div className="btn-box">
                            <button><i className="fa-light fa-pen"></i></button>
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

export default AllProductTable