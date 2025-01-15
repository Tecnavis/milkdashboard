import React, { useEffect, useState } from "react";
import { companyData } from "../../data/Data";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";

import { Modal, Button, Form, Alert } from "react-bootstrap";
import {
  fetchAllWarehouse,
  deleteWarehouse,
  updateWarehouse,
} from "../../Helper/handle-api";
const CompanyTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState(companyData);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedCustomer = await updateWarehouse(
        selectedCustomer._id,
        selectedCustomer
      );
      setAllwarehouse((prev) =>
        prev.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to update customer:", error);
    }
  };
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
                    <button onClick={() => handleEditClick(data)}>
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
      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={selectedCustomer.name || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={selectedCustomer.phone || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedCustomer.email || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={selectedCustomer.address || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyTable;
