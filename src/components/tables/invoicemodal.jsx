import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";

const InvoiceModal = ({ show, onHide, customerId, URL }) => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!customerId) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${URL}/orderdetails/product-items/${customerId}`
        );
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
  }, [customerId, show, URL]);

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton className="text-white">
        <Modal.Title style={{color:"white"}}>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">Loading invoice data...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="invoice">
            <div className="invoice-header mb-30">
            </div>

            {/* Customer, Shipping, and Invoice Details */}
            <div className="invoice-body">
              <div className="info-card-wrap mb-30">
                <div className="row">
                  <div className="col-md-4" style={{textAlign:"start"}}>
                    <div className="info-card">
                    <b className="mb-1" style={{marginBottom:"5px"}}>CUSTOMER DETAILS</b><br/>
                        <p className="mb-1">Name: {invoiceData[0]?.customer?.name || "N/A"}</p>
                      <p className="mb-1">
                        Address: {invoiceData[0]?.address?.postcode || " "} {invoiceData[0]?.address?.streetAddress || " "}, {invoiceData[0]?.address?.streetAddress || " "}
                      </p>
                      <p className="mb-1">Email: {invoiceData[0]?.customer?.email || " "}</p>
                      <p className="mb-1">Phone: +91 {invoiceData[0]?.customer?.phone || " "}</p>
                    </div>
                  </div>
                  <div className="col-md-4" style={{textAlign:"center"}}>
                    <div className="info-card">
                    <b className="mb-1" >PALKKARAN INVOICE</b>
                    </div>
                  </div>

                  <div className="col-md-4" style={{textAlign:"end"}}>
                    <div className="info-card">
                    <b className="mb-1" style={{marginBottom:"5px"}}>INVOICE DETAILS</b><br/>
                        <p className="mb-1">Invoice No: {invoiceData[0]?.customer.customerId || "N/A"}</p>
                      <p className="mb-1">
                      Payment Type: {invoiceData[0]?.paymentMethod || "N/A"}
                      </p>
                      <p className="mb-1">
                      Payment Status: {invoiceData[0]?.paymentStatus || "N/A"}
                      </p>
                     
                    </div>
                  </div>
                </div>
              </div>

              {/* Unified Table for Product Details */}
              <div className="table-responsive mb-30">
                <table className="table table-bordered mb-0 invoice-table">
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Products</th>
                      <th>Qty.</th>
                      <th>Router Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.flatMap((invoice, planIndex) =>
                      invoice.selectedPlanDetails?.dates
                        .filter((dateItem) => dateItem.status === "delivered")
                        .map((dateItem, index) => (
                          <React.Fragment key={`${planIndex}-${index}`}>
                            <tr>
                              <td>{index + 1}</td>
                              <td>{new Date(dateItem.date).toLocaleDateString()}</td>
                              <td>{dateItem.status}</td>
                              <td colSpan="3">Products:</td>
                              <td rowSpan={invoice.productItems.length}>
                                ₹
                                {invoice.productItems
                                  .reduce(
                                    (acc, item) =>
                                      acc + item.quantity * item.routePrice,
                                    0
                                  )
                                  .toFixed(2)}
                              </td>
                            </tr>
                            {invoice.productItems.map((item, i) => (
                              <tr key={`${planIndex}-${index}-${i}`}>
                                <td colSpan="3"></td>
                                <td>{item.product?.category}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.routePrice}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Amount */}
              <div className="total-payment-area row justify-content-end mb-30">
  <div className="col-md-4">
    <ul>
      <li className="d-flex justify-content-between">
        Total:
        <span>
          ₹
          {invoiceData
            .flatMap((invoice) =>
              invoice.selectedPlanDetails?.dates
                .filter((dateItem) => dateItem.status === "delivered")
                .map((dateItem) =>
                  invoice.productItems.reduce(
                    (acc, item) => acc + item.quantity * item.routePrice,
                    0
                  )
                )
            )
            .reduce((total, subtotal) => total + subtotal, 0)
            .toFixed(2)}
        </span>
      </li>
    </ul>
  </div>
</div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => window.print()}
        >
         Send
        </button>
        <button className="btn btn-sm btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
