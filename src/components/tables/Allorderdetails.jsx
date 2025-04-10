import React, { useEffect, useState } from "react";
import { Table, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { BsCalendarCheck } from "react-icons/bs";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import DataTableFilter from "../filter/DataTableFilter";
import PaginationSection from "./PaginationSection";
import { fetchAllOrders, URL, deleteOrder } from "../../Helper/handle-api";
import axios from "axios";
import "./style.scss";
import Swal from "sweetalert2";
import ChangePlanModal from "./Changeplan";
import InvoiceModal from './invoicemodal';
const ScrollDataTableSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [currentOrderIdForPlanChange, setCurrentOrderIdForPlanChange] =
    useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await fetchAllOrders();
        // Validate and transform the data
        const validatedOrders = res.map((order) => ({
          ...order,
          selectedPlanDetails: order.selectedPlanDetails || {
            planType: "N/A",
            dates: [],
            isActive: false,
          },
          customer: order.customer || { name: "Unknown" },
          productItems: order.productItems || [],
          address: order.address || {
            postcode: "N/A",
            streetAddress: "N/A",
            apartment: "N/A",
          },
        }));
        const sortedOrders = validatedOrders.sort((a, b) => {
          // First try to sort by createdAt if available
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          // Fall back to sorting by _id (MongoDB ObjectIds contain a timestamp)
          return b._id > a._id ? 1 : -1;
        });
        setAllOrders(sortedOrders);
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);


  const filteredOrders = allOrders.filter((order) => {
    
    const customerName = order.customer?.name?.toLowerCase() || '';
    const productNames = order.productItems.map(item => item.product?.category?.toLowerCase() || '').join(' ');
    const customerId = order.customer?.customerId?.toLowerCase() || '';
  

  
    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      productNames.includes(searchTerm.toLowerCase()) ||
      customerId.includes(searchTerm.toLowerCase()) 
    );
  });

  
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredOrders.slice(indexOfFirstData, indexOfLastData);
  

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {

  }, [])

  const totalPages = Math.ceil(allOrders.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePlanClick = (planDetails, orderId) => {
    if (!planDetails) {
      console.warn("No plan details available for this order");
      return;
    }
    setSelectedPlan(planDetails);
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
    setSelectedOrderId(null);
    setShowModal(false);
  };
  //update delivery status
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
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  selectedPlanDetails: {
                    ...order.selectedPlanDetails,
                    dates: (order.selectedPlanDetails?.dates || []).map(
                      (dateObj) =>
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
  //delete order
  const handleDeleteOrder = async (id) => {
    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Order ID not found. Please try again.",
      });
      return;
    }

    try {
      await deleteOrder(id);
      setAllOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== id)
      );
      Swal.fire("Deleted!", "The order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order:", error);
      Swal.fire(
        "Error",
        "Failed to delete the order. Please try again.",
        "error"
      );
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="alert alert-danger m-4">{error}</div>;
  }

  const handleChangePlan = (orderId) => {
    setCurrentOrderIdForPlanChange(orderId);
    setShowChangePlanModal(true);
  };
  //stop plan
  const handleStopPlan = async (orderId) => {
    if (!orderId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Order ID not found. Please try again.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${URL}/orderdetails/stop-plan/${orderId}`
      );

      if (response.status === 200) {
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  selectedPlanDetails: {
                    ...order.selectedPlanDetails,
                    isActive: false,
                  },
                }
              : order
          )
        );

        Swal.fire("Success", "Plan stopped successfully", "success");
      }
    } catch (error) {
      console.error("Error stopping plan:", error);
      Swal.fire("Error", "Failed to stop the plan. Please try again.", "error");
    }
  };
//cancel order
const handleCancelStatus = async (orderId, date) => {
  if (!orderId || !date) {
    console.error("Missing orderId or date for canceling.");
    return;
  }

  try {
    const response = await axios.patch(
      `${URL}/orderdetails/cancel/${orderId}`,
      { date }
    );

    if (response.status === 200) {
      setAllOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                selectedPlanDetails: {
                  ...order.selectedPlanDetails,
                  dates: (order.selectedPlanDetails?.dates || []).map(
                    (dateObj) =>
                      dateObj.date === date
                        ? { ...dateObj, status: "cancel" }
                        : dateObj
                  ),
                },
              }
            : order
        )
      );

      Swal.fire("Success", "Order canceled successfully", "success");
    }
  } catch (error) {
    console.error("Error canceling order:", error);
    Swal.fire("Error", "Failed to cancel the order. Please try again.", "error");
  }
};
  return (
    <div className="main-content">
      <div className="panel">
        <div className="panel-body">
          <div className="col-12">
            <div className="card">
              <div className="card-header">All Orders</div>
              <DataTableFilter
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

              <div className="card-body">
                <OverlayScrollbarsComponent
                  options={{
                    className: "os-theme-light",
                    scrollbars: {
                      autoHide: "scroll",
                    },
                  }}
                >
                  <div>
                    <Table
                      className="table table-dashed table-hover digi-dataTable table-striped"
                      id="componentDataTable"
                    >
                      <thead>
                        <tr>
                          <th className="no-sort">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />
                            </div>
                          </th>
                          <th>Customer ID</th>
                          <th>Customer Name</th>
                          <th>Product ID</th>
                          <th>Product Name</th>
                          <th>Plan Type</th>
                          <th>Is Active</th>
                          <th>Unit Price</th>
                          <th>Payment Method</th>
                          <th>Payment Status</th>
                          <th>Address</th>
                          <th style={{textAlign:"center"}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((order) =>
                          order.productItems.length > 0 ? (
                            order.productItems.map((item, index) => (
                              <tr
                                key={`${order._id}-${item.product?.productId}-${index}`}
                              >

                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                      />
                                    </div>
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    {order.customer?.customerId || "N/A"}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                   <Link
  to="#"
  onClick={() => {
    setSelectedCustomerId(order.customer?._id);
    setShowInvoiceModal(true);
  }}
>
  {order.customer?.name || "N/A"}
</Link>
                                  </td>
                                )}
                                <td>{item.product?.productId || "N/A"}</td>
                                <td>
                                  {item.product?.category || "N/A"} (
                                  {item.quantity})
                                </td>
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    <Link
                                      to="#"
                                      onClick={() =>
                                        handlePlanClick(
                                          order.selectedPlanDetails,
                                          order._id
                                        )
                                      }
                                    >
                                      {order.selectedPlanDetails?.planType ||
                                        "N/A"}
                                    </Link>
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    {order.selectedPlanDetails?.isActive
                                      ? "Yes"
                                      : "No"}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    ₹{order.totalPrice || 0}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    {order.paymentMethod || "N/A"}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    {order.paymentStatus || "N/A"}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    {order.address?.postcode || "N/A"}
                                    <br />
                                    {order.address?.streetAddress || "N/A"}
                                    <br />
                                    {order.address?.apartment || "N/A"}
                                  </td>
                                )}
                                {index === 0 && (
                                  <td rowSpan={order.productItems.length}>
                                    
                                    <button
                                      className="btn btn-primary btn-sm ms-2"
                                      onClick={() =>
                                        handleChangePlan(order._id)
                                      }
                                    >
                                      Change Plan
                                    </button>
                                    {order.selectedPlanDetails?.isActive ? (
                                      <button
                                        className="btn btn-warning btn-sm ms-2"
                                        onClick={() =>
                                          handleStopPlan(order._id)
                                        }
                                      >
                                        Stop Plan
                                      </button>
                                    ) : (
                                      <span
                                        className="btn btn btn-sm ms-2"
                                        style={{
                                          backgroundColor: "gray",
                                          color: "white",
                                        }}
                                      >
                                        Stopped
                                      </span>
                                    )}
                                    <button
                                      className="btn btn-danger btn-sm ms-2"
                                      onClick={() =>
                                        handleDeleteOrder(order._id)
                                      }
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <>No orders found</>
                          )
                        )}
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

            <Modal
              show={showModal && selectedPlan !== null}
              onHide={handleCloseModal}
              centered
              className="custom-modal"
            >
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title className="fw-bold">
                  Plan Details: {selectedPlan?.planType || "N/A"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="p-4">
                <h5 className="mb-4 text-secondary">
                  Plan Type: {selectedPlan?.planType || "N/A"}
                </h5>
                <ul className="list-group mb-3">
                  {selectedPlan?.dates?.map((dateObj, idx) => (
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
                              handleDeliveryStatus(
                                selectedOrderId,
                                dateObj.date
                              )
                            }
                          >
                            Delivered
                          </button>
                        )}
                      </div>
                      <div className="d-flex align-items-center">
                        {dateObj.status !== "cancel" && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleCancelStatus(
                                selectedOrderId,
                                dateObj.date
                              )
                            }
                          >
                            Cancel
                          </button>
                        )}  
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <h6 className="mb-0 text-secondary">Plan Active Status:</h6>
                  {selectedPlan?.isActive ? (
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
          </div>
        </div>
      </div>
      <ChangePlanModal
        show={showChangePlanModal}
        onHide={() => setShowChangePlanModal(false)}
        orderId={currentOrderIdForPlanChange}
        url={URL} // Assuming URL is defined in your helper/handle-api
      />
      <InvoiceModal
  show={showInvoiceModal}
  onHide={() => setShowInvoiceModal(false)}
  customerId={selectedCustomerId}
  URL={URL}
/>
    </div>
  );
};

export default ScrollDataTableSection;
