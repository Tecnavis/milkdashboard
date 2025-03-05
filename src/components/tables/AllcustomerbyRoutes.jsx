import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FetchCustomer, URL } from "../../Helper/handle-api";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [paidAmountId, setPaidAmountId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
      setCustomers(response);
      groupCustomersByRoute(response);
    };
    fetchCustomers();
  }, []);

  const groupCustomersByRoute = (customerList) => {
    const grouped = customerList.reduce((acc, customer) => {
      const routeKey = customer.routeno || "No Route";
      if (!acc[routeKey]) {
        acc[routeKey] = [];
      }
      acc[routeKey].push(customer);
      return acc;
    }, {});
    setGroupedCustomers(grouped);
  };

  const handlePaymentClick = (customer) => {
    setSelectedCustomer(customer);
    setAmount("");
    setIsConfirming(false);
    setPaidAmountId(null);
    setShowModal(true);
  };

  const handleAddPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please enter a valid amount.",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${URL}/customer/add-paid-amount/customer`,
        {
          customerId: selectedCustomer.customerId,
          amount: parseFloat(amount),
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment added successfully!",
      });
      setPaidAmountId(response.data.paidAmount._id);
      setIsConfirming(true);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error adding payment: " + error.response?.data?.message,
      });
    }
  };

  const handleConfirmPayment = async () => {
    if (!paidAmountId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No payment to confirm.",
      });
      return;
    }

    const { value: confirm } = await Swal.fire({
      title: "Are you sure you want to confirm this payment?",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "No, cancel!",
    });
    if (!confirm) return;

    try {
      await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
        customerId: selectedCustomer.customerId,
        paidAmountId,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment confirmed successfully!",
      });
      setIsConfirming(false);
      setPaidAmountId(null);
      setShowModal(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error confirming payment: " + error.response?.data?.message,
      });
    }
  };

  const handlePaymentHistoryClick = async (customerId) => {
    try {
      // Find the full customer details
      const customer = customers.find((c) => c.customerId === customerId);

      // Set the selected customer
      setSelectedCustomer(customer);

      // Fetch payment history
      const response = await axios.get(
        `${URL}/customer/paid-amounts/${customerId}`
      );
      setPaymentHistory(response.data.paidAmounts);
      setShowHistoryModal(true);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch payment history.",
      });
    }
  };

  const handleHistoryPaymentConfirmation = async (paymentId) => {
    // Add an extra check to ensure selectedCustomer exists
    if (!selectedCustomer) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Customer information is missing. Please try again.",
      });
      return;
    }

    const { value: confirm } = await Swal.fire({
      title: "Are you sure you want to confirm this payment?",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "No, cancel!",
    });

    if (!confirm) return;

    try {
      console.log("Confirming payment with:", {
        customerId: selectedCustomer.customerId,
        paidAmountId: paymentId,
      });

      const response = await axios.patch(
        `${URL}/customer/confirm-paid-amount/confirm`,
        {
          customerId: selectedCustomer.customerId,
          paidAmountId: paymentId,
        }
      );

      console.log("Confirmation response:", response.data);

      // Check if response indicates success
      if (response.data && (response.data.success || response.status === 200)) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Payment confirmed successfully!",
        });

        // Refresh payment history
        const historyResponse = await axios.get(
          `${URL}/customer/paid-amounts/${selectedCustomer.customerId}`
        );
        setPaymentHistory(historyResponse.data.paidAmounts);
      } else {
        // Handle case where response doesn't indicate success
        throw new Error("Payment confirmation failed");
      }
    } catch (error) {
      console.error("Full error object:", error);

      // More detailed error handling
      const errorMessage = error.response
        ? error.response.data?.message || error.response.data || "Unknown error"
        : error.message || "Network error";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error confirming payment: ${errorMessage}`,
        footer: error.response ? `Status: ${error.response.status}` : "",
      });
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.keys(groupedCustomers)
        .filter((routeNo) =>
          routeNo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((routeNo) => (
          <div key={routeNo}>
            <b>Route No: {routeNo}</b>
            <Table className="table table-dashed table-hover table-striped">
              <thead>
                <tr>
                  <th>Customer Id</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedCustomers[routeNo].map((data) => (
                  <tr key={data._id}>
                    <td style={{ textAlign: "center" }}>{data.customerId}</td>
                    <td>
                      <Link to="#">{data.name}</Link>
                    </td>
                    <td>{data.phone}</td>
                    <td>
                      {data.address.map((addr, index) => (
                        <div key={index}>
                          {addr.streetAddress}, {addr.apartment},{" "}
                          {addr.postcode}
                        </div>
                      ))}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePaymentClick(data)}
                        style={{ marginRight: "5px" }}
                      >
                        Do Payment
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() =>
                          handlePaymentHistoryClick(data.customerId)
                        }
                      >
                        Payment History
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <br/>
          </div>
        ))}

      {/* Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Payment for {selectedCustomer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Payment Amount</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleAddPayment}>
            Add Payment
          </Button>
          {isConfirming && (
            <Button variant="warning" onClick={handleConfirmPayment}>
              Confirm Payment
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Payment History for {selectedCustomer?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentHistory.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment._id}>
                    <td>{new Date(payment.date).toLocaleDateString()}</td>
                    <td>{payment.amount}</td>
                    <td>
                      {payment.isGet ? (
                        <span className="text-success">Paid</span>
                      ) : (
                        <>
                          <span className="text-danger">Unpaid</span>
                          <Button
                            variant="warning"
                            size="sm"
                            className="ms-2"
                            onClick={() =>
                              handleHistoryPaymentConfirmation(payment._id)
                            }
                          >
                            Confirm This payment
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No payment history available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowHistoryModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllCustomerTable;
