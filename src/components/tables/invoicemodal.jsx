import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

const InvoiceModal = ({ show, onHide, customerId, URL ,  customer}) => {

  
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 
  

  useEffect(() => {
    const FetchInvoice = async () => {
      setLoading(true);
      const monthStart = new Date(selectedYear, selectedMonth, 1);

      try {
        const response = await axios.get(
          `${URL}/invoice/${customerId}/date/${monthStart}`
        );
        setInvoiceData(response.data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch invoice data");
      } finally {
        setLoading(false);
      }
    };

    if (show && customerId) {
      FetchInvoice();
    }
  }, [customerId, show, URL, selectedMonth, selectedYear]);

  // ✅ Navigation handlers
  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (selectedMonth === 0) setSelectedYear((prev) => prev - 1);
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (selectedMonth === 11) setSelectedYear((prev) => prev + 1);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
  };

  // ✅ Email Invoice HTML
  const generateInvoiceHtml = () => {
    if (!invoiceData) return "";

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background: #007bff; color: #fff; }
        </style>
      </head>
      <body>
        <h2>Invoice - ${new Date(
          selectedYear,
          selectedMonth
        ).toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <p>Customer: ${invoiceData?.customerId?.name || "N/A"}</p>
        <p>Email: ${invoiceData?.customerId?.email || "N/A"}</p>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Date</th>
              <th>Status</th>
              <th>Product</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData?.orderItems
              ?.map(
                (orderItem, idx) =>
                  orderItem.products
                    ?.map(
                      (p, i) => `
                    <tr>
                      ${i === 0 ? `<td rowspan="${orderItem.products.length}">${idx + 1}</td>` : ""}
                      ${i === 0 ? `<td rowspan="${orderItem.products.length}">${new Date(orderItem.date).toLocaleDateString()}</td>` : ""}
                      ${i === 0 ? `<td rowspan="${orderItem.products.length}">${orderItem.status}</td>` : ""}
                      <td>${p.product}</td>
                      <td>${p.quantity}</td>
                      <td>₹${p.routePrice}</td>
                      ${i === 0 ? `<td rowspan="${orderItem.products.length}">₹${orderItem.products.reduce((acc, p) => acc + p.quantity * p.routePrice, 0)}</td>` : ""}
                    </tr>`
                    )
                    .join("")
              )
              .join("")}
          </tbody>
        </table>
        <p><strong>Monthly Total:</strong> ₹${invoiceData?.monthAmount || 0}</p>
        <p><strong>Monthly Paid Amount:</strong> ₹${invoiceData?.getAmount || 0}</p>
      </body>
    </html>`;
  };

  const sendInvoice = async () => {
    if (!invoiceData) return;
    setSending(true);

    const email = invoiceData?.customerId?.email;
    const invoiceHtml = generateInvoiceHtml();

    try {
      const response = await axios.post(`${URL}/orderdetails/send-invoice`, {
        email,
        invoiceHtml,
      });
      if (response.status === 200) {
        alert("Invoice sent successfully!");
      } else {
        alert("Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      alert("Error sending invoice");
    } finally {
      setSending(false);
    }
  };

  if (!show) return null;

  return (
    
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center", color: "black" }}>
          Invoice Details
        </Modal.Title>
      </Modal.Header>

      {/* Month Navigation */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <button className="btn btn-secondary" onClick={handlePreviousMonth}>
          Previous
        </button>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="form-select w-auto"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary" onClick={handleNextMonth}>
          Next
        </button>
      </div>


      <div className="d-flex">
          {/* Customer Details */}

          <div
            className=" p-3 flex-grow-1"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            <h5 className="fw-bold">Customer Details</h5>
            <p>
              <strong>Name:</strong> {invoiceData?.customerId?.name ||   customer?.name}
            </p>
            {/* <p><strong>Address:</strong> {invoiceData[0]?.customer?.address || "N/A"}</p> */}
            <p>
              <strong>Email:</strong> {invoiceData?.customerId?.email  ||  customer?.email}
            </p>
            <p>
              <strong>Phone:</strong> {invoiceData?.customerId?.phone ||  customer?.phone}
            </p>
          </div>
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              justifyContent: "center",
            }}
          >
            <b>PALKKARAN</b>
          </div>
          {/* Invoice Details */}
          <div
            className=" p-3 flex-grow-1"
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <h5 className="fw-bold">Invoice Details</h5>
            <p>
              <strong>Invoice No:</strong>{" "}
              {invoiceData?.customerId?.customerId || "N/A"}
            </p>
            <p>
              <strong>Payment Type:</strong>{" "}
              {invoiceData?.paymentType || "N/A"}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {invoiceData?.status || "N/A"}
            </p>
            <p>
              <strong>Total:</strong> ₹
              {invoiceData?.monthAmount}
            </p>
          </div>
        </div>

      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">Loading invoice data...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : invoiceData ? (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>ML</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.orderItems?.map((orderItem, idx) =>
                  orderItem.products.map((p, i) => (
                    <tr key={`${idx}-${i}`}>
                      {i === 0 && (
                        <td rowSpan={orderItem.products.length}>{idx + 1}</td>
                      )}
                      {i === 0 && (
                        <td rowSpan={orderItem.products.length}>
                          {new Date(orderItem.date).toLocaleDateString()}
                        </td>
                      )}
                      {i === 0 && (
                        <td rowSpan={orderItem.products.length}>
                          {orderItem.status}
                        </td>
                      )}
                      <td>{p.product}</td>
                      <td>{p.ml}</td>
                      <td>{p.quantity}</td>
                      <td>₹{p.routePrice}</td>
                      {i === 0 && (
                        <td rowSpan={orderItem.products.length}>
                          ₹
                          {orderItem.products.reduce(
                            (acc, p) => acc + p.quantity * p.routePrice,
                            0
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-end mt-3">
              <p>
                <strong>Monthly Total: </strong> ₹{invoiceData?.monthAmount}
              </p>
              <p>
                <strong>Monthly Paid Amount:</strong> ₹{invoiceData?.getAmount}
              </p>
              <p>
                <strong>Balance Amount:</strong> ₹{invoiceData?.getBalance}
              </p>
              <p>
                <strong>Pay Balance:</strong> ₹{invoiceData?.payBalance}
              </p>
            </div>
          </div>
        ) : (
          <p>No invoice data found.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-primary"
          onClick={sendInvoice}
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Invoice"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
