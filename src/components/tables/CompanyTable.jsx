import React, { useState } from "react";
import { companyData } from "../../data/Data";
import { Form } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
const CompanyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState(companyData);

  const handleCheckboxChange = (index) => {
    const updatedDataList = [...dataList];
    updatedDataList[indexOfFirstData + index].isChecked =
      !updatedDataList[indexOfFirstData + index].isChecked;
    setDataList(updatedDataList);
  };

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
        <table
          className="table table-dashed table-hover digi-dataTable company-table table-striped"
          id="companyTable"
        >
          <thead>
            <tr>
            <th>Date</th>
              <th> Warehouse</th>
              <th>Address</th>
              <th>Email</th>
              <th>Phone</th>

            </tr>
          </thead>
          <tbody>
            {currentData.map((data, index) => (
              <tr key={data.id}>
                <td>12/3/2024</td>
                <td>ware house</td>
                <td>Address</td>
                <td>email@gmail</td>
                <td>987654321</td>
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
