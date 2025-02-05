import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { orderListData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { FetchCustomer } from "../../Helper/handle-api";
const Salesorders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allCustomer, setAllCustomer] = useState([]);
  const [dataPerPage] = useState(10);
  const dataList = orderListData;
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
    FetchCustomer().then((res) => {
      setAllCustomer(res);
    });
  }, []);
  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Route No</th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allCustomer.map((data) => (
              <tr>
                <td style={{textAlign: "center"}}>{data.customerId}</td>
                <td>{data.name}</td>
                <td>{data.routeno}</td>
                <td>{data.routename}</td>
                <td>
                    <button className="btn btn-primary">Order Product</button>
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
};

export default Salesorders;
