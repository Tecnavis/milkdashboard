import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import DataTableFilter from "../filter/DataTableFilter";
import PaginationSection from "./PaginationSection";
import "./style.css"
import { BsCalendarCheck } from "react-icons/bs"; // Calendar icons for status
import { FiCheckCircle, FiXCircle } from "react-icons/fi"; // Check and cross icons for plan active status
import { Modal } from "react-bootstrap"; // Assuming you're using Bootstrap
import { fetchAllOrders } from "../../Helper/handle-api";
const ScrollDataTableSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null); // State for selected plan details
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchAllOrders()
      .then((res) => {
        setAllOrders(res); // Ensure `res` is an array
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = allOrders.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(allOrders.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const handlePlanClick = (planDetails) => {
    setSelectedPlan(planDetails);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setShowModal(false);
  };
  return (
    <div className="col-12">
      <div className="card">
        <div className="card-header">All Orders</div>
        <DataTableFilter />

        <div className="card-body">
          <OverlayScrollbarsComponent
            options={{
              className: "os-theme-light",
              scrollbars: {
                autoHide: "scroll",
              },
            }}
          >
            <div style={{ maxHeight: "300px" }}>
              <Table
                className="table table-dashed table-hover digi-dataTable table-striped"
                id="componentDataTable"
              >
                <thead>
                  <tr>
                    <th className="no-sort">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" />
                      </div>
                    </th>
                    <th>Customer Name</th>
                    <th>Product ID</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Plan Type</th>
                    <th>Is Active</th>
                    <th>Total Price</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" />
                        </div>
                      </td>
                      <td>
                        <Link to="#">{order.customer.name}</Link>
                      </td>
                      <td>
                        {order.cartItems
                          .map((item) => item.product.productId)
                          .join(", ")}
                      </td>
                      <td>
                        {order.cartItems
                          .map((item) => item.product.price)
                          .join(", ")}
                      </td>
                      <td>
                        {order.cartItems
                          .map((item) => item.quantity)
                          .join(", ")}
                      </td>
                      <td>
                        <Link
                          to="#"
                          onClick={() =>
                            handlePlanClick(order.selectedPlanDetails)
                          }
                        >
                          {order.selectedPlanDetails.planType || "N/A"}
                        </Link>
                      </td>
                      
                      <td>
                        {order.selectedPlanDetails.isActive ? "Yes" : "No"}
                      </td>
                      <td>${order.totalPrice}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.paymentStatus}</td>
                      <td>
                        <Link to="#" className="btn btn-sm btn-primary">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </OverlayScrollbarsComponent>
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            pageNumbers={pageNumbers}
          />
        </div>
      </div>
      {/* Plan Details Modal */}
      {selectedPlan && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          className="custom-modal"
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title className="fw-bold">
              Plan Details: {selectedPlan.planType}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <h5 className="mb-4 text-secondary">Plan Type: {selectedPlan.planType}</h5>
            <ul className="list-group mb-3">
              {selectedPlan.dates.map((dateObj, idx) => (
                <li
                  key={idx}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    dateObj.status === "completed"
                      ? "bg-light-success"
                      : "bg-light-warning"
                  }`}
                >
                  <div>
                    <BsCalendarCheck className="me-2 text-info" />
                    <strong>Date:</strong> {new Date(dateObj.date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        dateObj.status === "completed"
                          ? "bg-success text-white"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {dateObj.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex align-items-center justify-content-between mt-4">
              <h6 className="mb-0 text-secondary">Plan Active Status:</h6>
              {selectedPlan.isActive ? (
                <div className="text-success d-flex align-items-center">
                  <FiCheckCircle className="me-2" />
                  Active
                </div>
              ) : (
                <div className="text-danger d-flex align-items-center">
                  <FiXCircle className="me-2" />
                  Inactive
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ScrollDataTableSection;
