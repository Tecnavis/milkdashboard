import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

const InvoiceModal = ({ show, onHide, customerId, URL }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!customerId) return;

      try {
        setLoading(true);
        const response = await axios.get(`${URL}/orderdetails/invoices/${customerId}`);
        setInvoiceData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch invoice data");
        console.error("Error fetching invoice data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchInvoiceData();
    }
  }, [customerId, show, URL, selectedMonth, selectedYear]);

  const sendInvoice = async () => {
    if (!invoiceData.length) return;
    setSending(true);

    const email = invoiceData[0]?.customer?.email;
    const invoiceHtml = `<html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #007bff; color: #fff; }
      </style>
    </head>
    <body>
      <h2>Invoice Details</h2>
      <p>Customer: ${invoiceData[0]?.customer?.name || "N/A"}</p>
      <p>Email: ${email || "N/A"}</p>
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
          ${invoiceData.flatMap((invoice, planIndex) =>
            invoice.orderItems?.map((orderItem, index) => 
              orderItem.products.map((p, pIndex) => `
                <tr>
                  ${pIndex === 0 ? `<td rowspan="${orderItem.products.length}">${index + 1}</td>` : ""}
                  ${pIndex === 0 ? `<td rowspan="${orderItem.products.length}">${new Date(orderItem.date).toLocaleDateString()}</td>` : ""}
                  ${pIndex === 0 ? `<td rowspan="${orderItem.products.length}">${orderItem.status}</td>` : ""}
                  <td>${p.product}</td>
                  <td>${p.quantity}</td>
                  <td>₹${p.routePrice}</td>
                  ${pIndex === 0 ? `<td rowspan="${orderItem.products.length}">₹${orderItem.products.reduce((acc, p) => acc + p.quantity * p.routePrice, 0)}</td>` : ""}
                </tr>
              `).join('')
            )
          ).join('')}
        </tbody>
      </table>
      <p><strong>Total:</strong> ₹${invoiceData.reduce((total, inv) => total + inv.total, 0)}</p>
    </body>
    </html>`;

    try {
      const response = await axios.post(`${URL}/orderdetails/send-invoice`, { email, invoiceHtml });
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


  const filteredInvoices = invoiceData.filter((inv) =>
    inv.orderItems.some((orderItem) => {
      const orderDate = new Date(orderItem.date);
      return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
    })
  );
  
  // Calculate Monthly Total
  const monthlyTotal = filteredInvoices.reduce(
    (total, inv) => total + inv.total,
    0
  );
  
  
  const handleMonthChange = (e) => {
    const selected = parseInt(e.target.value, 10);
    setSelectedMonth(selected);
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ textAlign: "center" ,color:"white"}}>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-secondary" onClick={handlePreviousMonth}>
            Previous
          </button>
          <select value={selectedMonth} onChange={handleMonthChange} className="form-select w-auto">
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

            <div className=" p-3 flex-grow-1" style={{display:'flex', flexDirection:'column',textAlign:'left'}}>
              <h5 className="fw-bold">Customer Details</h5>
              <p><strong>Name:</strong> {invoiceData[0]?.customer?.name || "N/A"}</p>
              {/* <p><strong>Address:</strong> {invoiceData[0]?.customer?.address || "N/A"}</p> */}
              <p><strong>Email:</strong> {invoiceData[0]?.customer?.email || "N/A"}</p>
              <p><strong>Phone:</strong> {invoiceData[0]?.customer?.phone || "N/A"}</p>
            </div>
<div className="" style={{display:'flex', flexDirection:'column',textAlign:'center',justifyContent:'center'}}>
  <b>PALKKARAN</b>
</div>
            {/* Invoice Details */}
            <div className=" p-3 flex-grow-1" style={{display:'flex', flexDirection:'column',textAlign:'right'}}>
              <h5 className="fw-bold">Invoice Details</h5>
              <p><strong>Invoice No:</strong> {invoiceData[0]?.customer?.customerId || "N/A"}</p>
              <p><strong>Payment Type:</strong> {invoiceData[0]?.invoiceDetails?.paymentType || "N/A"}</p>
              <p><strong>Payment Status:</strong> {invoiceData[0]?.invoiceDetails?.paymentStatus || "N/A"}</p>
              <p><strong>Total:</strong> ₹{invoiceData.reduce((total, inv) => total + inv.total, 0)}</p>
            </div>
          </div>
      </Modal.Body>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">Loading invoice data...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.flatMap((invoice, planIndex) =>
                  invoice.orderItems?.map((orderItem, index) =>
                    orderItem.products.map((p, pIndex) => (
                      <tr key={`${planIndex}-${index}-${pIndex}`}>
                        {pIndex === 0 && <td rowSpan={orderItem.products.length}>{index + 1}</td>}
                        {pIndex === 0 && <td rowSpan={orderItem.products.length}>{new Date(orderItem.date).toLocaleDateString()}</td>}
                        {pIndex === 0 && <td rowSpan={orderItem.products.length}>{orderItem.status}</td>}
                        <td style={{textAlign:'center'}}>{p.product}</td>
                        <td style={{textAlign:'center'}}>{p.quantity}</td>
                        <td style={{textAlign:'center'}}>₹{p.routePrice}</td>
                        {pIndex === 0 && <td rowSpan={orderItem.products.length}>₹{orderItem.products.reduce((acc, p) => acc + p.quantity * p.routePrice, 0)}</td>}
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
            <br/>
            <div className="text-end">
              {/* //  {data?.customer?.paidAmounts?.reduce((sum, payment) => sum + payment.amount, 0)} */}
              <div className="text-end">
  <p><strong>Monthly Total: </strong> ₹{monthlyTotal}</p>
</div>



              <p><strong>Your Total Bill: ₹{invoiceData.reduce((total, inv) => total + inv.total, 0)}</strong></p>
            <p><strong> Paid Amount : ₹{invoiceData[0]?.customer?.paidAmounts?.reduce((sum, payment) => sum + payment.amount, 0)}</strong></p>
            <p>
  <strong>
   Total Balance Amount : ₹
    {invoiceData.reduce((total, inv) => total + inv.total, 0) - 
     invoiceData[0]?.customer?.paidAmounts?.reduce((sum, payment) => sum + payment.amount, 0)}
  </strong>
</p>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={sendInvoice} disabled={sending}>
          {sending ? "Sending..." : "Send Invoice"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;