import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import DataTableFilter from "../filter/DataTableFilter";
import PaginationSection from "./PaginationSection";
import "./style.css"
import { BsCalendarCheck } from "react-icons/bs";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Modal } from "react-bootstrap";
import { fetchAllOrders, URL ,deleteOrder} from "../../Helper/handle-api";
import axios from "axios";

const ScrollDataTableSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null); // New state for order ID
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllOrders()
      .then((res) => {
        setAllOrders(res);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = allOrders.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(allOrders.length / dataPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePlanClick = (planDetails, orderId) => {
    setSelectedPlan(planDetails);
    setSelectedOrderId(orderId); // Store the order ID when plan is clicked
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setSelectedOrderId(null);
    setShowModal(false);
  };
  
  const handleDeliveryStatus = async (orderId, date) => {
    if (!orderId || !date) {
      console.error("Missing orderId or date for updating status.");
      return;
    }
  
    try {
      const response = await axios.patch(`${URL}/orderdetails/${orderId}`, {
        status: "delivered",
        date,
      });
  
      if (response.status === 200) {
        console.log("Status updated successfully:", response.data);
  
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  selectedPlanDetails: {
                    ...order.selectedPlanDetails,
                    dates: order.selectedPlanDetails.dates.map((dateObj) =>
                      dateObj.date === date
                        ? { ...dateObj, status: "delivered" }
                        : dateObj
                    ),
                  },
                }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id);
        // Update the state to remove the deleted order
        setAllOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
        alert("Order deleted successfully.");
      } catch (error) {
        console.error("Error deleting order:", error);
        alert("Failed to delete the order. Please try again.");
      }
    }
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
                    <th>Address</th>
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
                        {order.productItems
                          .map((item) => item.product.productId)
                          .join(", ")}
                      </td>
                      <td>
                        {order.productItems
                          .map((item) => item.product.price)
                          .join(", ")}
                      </td>
                      <td>
                        {order.productItems
                          .map((item) => item.quantity)
                          .join(", ")}
                      </td>
                      <td>
                        <Link
                          to="#"
                          onClick={() =>
                            handlePlanClick(
                              order.selectedPlanDetails,
                              order._id
                            )
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
                      <td>{order.address.postcode}<br/>
                      {order.address.streetAddress}<br/>
                      {order.address.apartment}
                      </td>
                      <td>
  <button
    className="btn btn-danger btn-sm"
    onClick={() => handleDeleteOrder(order._id)}
  >
    <i className="fa-solid fa-trash"></i> Delete
  </button>
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
            <h5 className="mb-4 text-secondary">
              Plan Type: {selectedPlan.planType}
            </h5>
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
                    <strong>Date:</strong>{" "}
                    {new Date(dateObj.date).toLocaleDateString()}
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
                  <div className="d-flex align-items-center">
                    {dateObj.status !== "delivered" && (
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleDeliveryStatus(selectedOrderId, dateObj.date)
                        }
                      >
                        Delivered success
                      </button>
                    )}
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
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ScrollDataTableSection;