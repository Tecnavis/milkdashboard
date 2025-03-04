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
    })
      return;
    }

    try {
      const response = await axios.post(`${URL}/customer/add-paid-amount/customer`, {
        customerId: selectedCustomer.customerId,
        amount: parseFloat(amount),
      });

    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Payment added successfully!",
    })
      setPaidAmountId(response.data.paidAmount._id);
      setIsConfirming(true);
    } catch (error) {
    //   alert("Error adding payment: " + error.response?.data?.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error adding payment: " + error.response?.data?.message,
    })
    }
  };

  const handleConfirmPayment = async () => {
    if (!paidAmountId) {
    //   alert("No payment to confirm.");
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No payment to confirm.",
    })
      return;
    }

    // const confirm = window.confirm("Are you sure you want to confirm this payment?");
    const { value: confirm } = await Swal.fire({
      title: "Are you sure you want to confirm this payment?",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "No, cancel!",
    })
    if (!confirm) return;

    try {
      await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
        customerId: selectedCustomer.customerId,
        paidAmountId,
      });

    //   alert("Payment confirmed successfully!");
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Payment confirmed successfully!",
    })
      setIsConfirming(false);
      setPaidAmountId(null);
      setShowModal(false);
    } catch (error) {
    //   alert("Error confirming payment: " + error.response?.data?.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error confirming payment: " + error.response?.data?.message,
    })
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.keys(groupedCustomers)
        .filter((routeNo) => routeNo.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    <td><Link to="#">{data.name}</Link></td>
                    <td>{data.phone}</td>
                    <td>
                      {data.address.map((addr, index) => (
                        <div key={index}>{addr.streetAddress}, {addr.apartment}, {addr.postcode}</div>
                      ))}
                    </td>
                    <td>
                      <Button variant="primary" size="sm" onClick={() => handlePaymentClick(data)}>
                        Payment
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
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
    </div>
  );
};

export default AllCustomerTable;
