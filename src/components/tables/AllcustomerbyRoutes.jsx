import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FetchCustomer, URL } from "../../Helper/handle-api";
import { Link } from "react-router-dom";
import axios from "axios";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [amount, setAmount] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [paidAmountId, setPaidAmountId] = useState(null);

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
  };

  const handleAddPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(`${URL}/customer/add-paid-amount/customer`, {
        customerId: selectedCustomer.customerId,
        amount: parseFloat(amount),
      });

      alert("Payment added successfully!");
      setPaidAmountId(response.data.paidAmount._id);
      setIsConfirming(true);
    } catch (error) {
      alert("Error adding payment: " + error.response?.data?.message);
    }
  };

  const handleConfirmPayment = async () => {
    if (!paidAmountId) {
      alert("No payment to confirm.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to confirm this payment?");
    if (!confirm) return;

    try {
      await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
        customerId: selectedCustomer.customerId,
        paidAmountId,
      });

      alert("Payment confirmed successfully!");
      setIsConfirming(false);
      setPaidAmountId(null);
    } catch (error) {
      alert("Error confirming payment: " + error.response?.data?.message);
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
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handlePaymentClick(data)}
                      >
                        Payment
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}

      {/* Payment Modal (Simple Input Form) */}
      {selectedCustomer && (
        <div className="payment-modal">
          <h4>Enter Payment Amount for {selectedCustomer.name}</h4>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="form-control"
          />
          <button className="btn btn-success mt-2" onClick={handleAddPayment}>
            Add Payment
          </button>

          {isConfirming && (
            <button className="btn btn-warning mt-2" onClick={handleConfirmPayment}>
              Confirm Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AllCustomerTable;
