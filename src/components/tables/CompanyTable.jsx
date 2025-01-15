import React, { useEffect, useState } from "react";
import { companyData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchAllWarehouse, deleteWarehouse } from "../../Helper/handle-api";
const CompanyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState(companyData);

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

  const [allwarehouse, setAllwarehouse] = useState([]);
  useEffect(() => {
    fetchAllWarehouse().then((res) => {
      setAllwarehouse(res);
    });
  });
  return (
    <>
      <OverlayScrollbarsComponent>
        <table
          className="table table-dashed table-hover digi-dataTable company-table table-striped"
          id="companyTable"
        >
          <thead>
            <tr>
              <th> Warehouse</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allwarehouse.map((data, index) => (
              <tr key={data._id}>
                <td>{data.name}</td>
                <td>{data.address}</td>
                <td>{data.email}</td>
                <td>{data.phone}</td>
                <td>
                  <div className="btn-box">
                    <button>
                      <i className="fa-light fa-pen"></i>
                    </button>
                    <button>
                      <i
                        className="fa-light fa-trash"
                        onClick={() => deleteWarehouse(data._id)}
                      ></i>
                    </button>
                  </div>{" "}
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

export default CompanyTable;
