import React, { useEffect, useState } from "react";
import { customerData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchRoutes,fetchProducts } from "../../Helper/handle-api";
const CustomerTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [allRoutes, setAllRoutes] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [dataList, setDataList] = useState(
    customerData.map((data) => ({ ...data, showDropdown: false }))
  );

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
 useEffect(() => {
     const fetchAllRoutes = async () => {
           const response = await fetchRoutes();
           // Adjust this based on the actual response structure
           if (response && response.routes) {
             setAllRoutes(response.routes);
           } else if (Array.isArray(response)) {
             setAllRoutes(response);
           } else {
             setAllRoutes([]);
           }
         };
         fetchAllRoutes();

         fetchProducts().then((res)=>{
            setAllProducts(res);
         })
   }, []);

  return (
    <>
      <OverlayScrollbarsComponent>
        <table
          className="table table-dashed table-hover digi-dataTable all-customer-table table-striped"
          id="allCustomerTable"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allRoutes.map((route, index) => (
                
            
            <tr key={index}>
              <td>{index+1}</td>
              <td>{route.name}</td>
              <td>
                <button className="btn btn-sm btn-primary">
                  Select Product
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </OverlayScrollbarsComponent>

      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
    </>
  );
};

export default CustomerTable;
