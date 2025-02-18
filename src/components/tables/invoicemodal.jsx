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
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Invoice Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center p-4">Loading invoice data...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="invoice">
            <div className="invoice-header mb-30">
              <div className="row justify-content-between align-items-end">
                <div className="col-xl-4 col-lg-5 col-sm-6">
                  <div className="shop-address">
                    <div className="part-txt">
                      <p className="mb-1">
                        Address: 456 E-Commerce Avenue, Cityville
                      </p>
                      <p className="mb-1">Email: support@example.com</p>
                      <p className="mb-1">Phone: +1 (800) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer, Shipping, and Invoice Details */}
            <div className="invoice-body">
              <div className="info-card-wrap mb-30">
                <div className="row">
                  <div className="col-md-4">
                    <div className="info-card">
                      <h3>Customer Details:</h3>
                      <ul className="p-0">
                        <li>
                          <span>Name:</span> {invoiceData[0]?.customer?.name || "N/A"}
                        </li>
                        <li>
                          <span>Email:</span> {invoiceData[0]?.customer?.email || "N/A"}
                        </li>
                        <li>
                          <span>Phone:</span> {invoiceData[0]?.customer?.phone || "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-card">
                      <h3>Shipping Address:</h3>
                      <ul className="p-0">
                        <li>
                          <span>Address:</span> {invoiceData[0]?.address?.streetAddress || "N/A"}
                        </li>
                        <li>
                          <span>Apartment:</span> {invoiceData[0]?.address?.apartment || "N/A"}
                        </li>
                        <li>
                          <span>Postcode:</span> {invoiceData[0]?.address?.postcode || "N/A"}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="info-card">
                      <h3>Invoice Details:</h3>
                      <ul className="p-0">
                        <li>
                          <span>Invoice No.:</span> {invoiceData[0]?._id || "N/A"}
                        </li>
                        <li>
                          <span>Payment Type:</span> {invoiceData[0]?.paymentMethod || "N/A"}
                        </li>
                        <li>
                          <span>Payment Status:</span> {invoiceData[0]?.paymentStatus || "N/A"}
                        </li>
                      </ul>
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
                            invoice.productItems.map(
                              (item) => item.quantity * item.routePrice
                            )
                          )
                          .reduce((total, item) => total + item, 0)
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
          <i className="fa-light fa-print"></i> Print
        </button>
        <button className="btn btn-sm btn-secondary" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
