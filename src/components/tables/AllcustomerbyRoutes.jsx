// import React, { useEffect, useState } from "react";
// import { Table, Modal, Button, Form } from "react-bootstrap";
// import { FetchCustomer, URL } from "../../Helper/handle-api";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// const AllCustomerTable = ({ searchTerm }) => {
//   const [customers, setCustomers] = useState([]);
//   const [groupedCustomers, setGroupedCustomers] = useState({});
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [amount, setAmount] = useState("");
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [paidAmountId, setPaidAmountId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [paymentHistory, setPaymentHistory] = useState([]);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
//   const [paymentDate, setPaymentDate] = useState("");

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingPayment, setEditingPayment] = useState(null);
//   const [editAmount, setEditAmount] = useState("");
//   const [editDate, setEditDate] = useState("");

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const response = await FetchCustomer();
//       setCustomers(response);
//       groupCustomersByRoute(response);
//     };
//     fetchCustomers();
//   }, []);

//   const groupCustomersByRoute = (customerList) => {
//     const grouped = customerList.reduce((acc, customer) => {
//       const routeKey = customer.routeno || "No Route";
//       if (!acc[routeKey]) acc[routeKey] = [];
//       acc[routeKey].push(customer);
//       return acc;
//     }, {});
//     setGroupedCustomers(grouped);
//   };

//   const handlePaymentClick = (customer) => {
//     setSelectedCustomer(customer);
//     setAmount("");
//     setIsConfirming(false);
//     setPaidAmountId(null);
//     setShowModal(true);
//   };

//   const handleAddPayment = async () => {
//     if (!amount || parseFloat(amount) <= 0 || !paymentDate) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please enter a valid amount and select a date.",
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${URL}/customer/add-paid-amount/customer`,
//         {
//           customerId: selectedCustomer.customerId,
//           amount: parseFloat(amount),
//           date: paymentDate,
//         }
//       );

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Payment added successfully!",
//       });
//       setPaidAmountId(response.data.paidAmount._id);
//       setIsConfirming(true);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error adding payment: " + error.response?.data?.message,
//       });
//     }
//   };

//   const handleConfirmPayment = async () => {
//     if (!paidAmountId) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "No payment to confirm.",
//       });
//       return;
//     }

//     const { value: confirm } = await Swal.fire({
//       title: "Are you sure you want to confirm this payment?",
//       showCancelButton: true,
//       confirmButtonText: "Yes, confirm it!",
//       cancelButtonText: "No, cancel!",
//     });
//     if (!confirm) return;

//     try {
//       await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
//         customerId: selectedCustomer.customerId,
//         paidAmountId,
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Payment confirmed successfully!",
//       });
//       setIsConfirming(false);
//       setPaidAmountId(null);
//       setShowModal(false);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error confirming payment: " + error.response?.data?.message,
//       });
//     }
//   };

//   const handlePaymentHistoryClick = async (customerId) => {
//     try {
//       const customer = customers.find((c) => c.customerId === customerId);
//       setSelectedCustomer(customer);

//       const response = await axios.get(
//         `${URL}/customer/paid-amounts/${customerId}`
//       );
//       setPaymentHistory(response.data.paidAmounts);
//       setShowHistoryModal(true);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to fetch payment history.",
//       });
//     }
//   };

//   const handleHistoryPaymentConfirmation = async (paymentId) => {
//     if (!selectedCustomer) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Customer information is missing. Please try again.",
//       });
//       return;
//     }

//     const { value: confirm } = await Swal.fire({
//       title: "Are you sure you want to confirm this payment?",
//       showCancelButton: true,
//       confirmButtonText: "Yes, confirm it!",
//       cancelButtonText: "No, cancel!",
//     });
//     if (!confirm) return;

//     try {
//       await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
//         customerId: selectedCustomer.customerId,
//         paidAmountId: paymentId,
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Success",
//         text: "Payment confirmed successfully!",
//       });

//       const historyResponse = await axios.get(
//         `${URL}/customer/paid-amounts/${selectedCustomer.customerId}`
//       );
//       setPaymentHistory(historyResponse.data.paidAmounts);
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error confirming payment: " + error.response?.data?.message,
//       });
//     }
//   };

//   const handleEditClick = (payment) => {
//     setEditingPayment(payment);
//     setEditAmount(payment.amount.toString());
//     const dateObj = new Date(payment.date);
//     const formattedDate = dateObj.toISOString().split("T")[0];
//     setEditDate(formattedDate);
//     setShowEditModal(true);
//   };

//   const handleSaveEdit = async () => {
//     if (!editAmount || parseFloat(editAmount) <= 0 || !editDate) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Please enter a valid amount and select a date.",
//       });
//       return;
//     }

//     try {
//       const response = await axios.patch(`${URL}/customer/update-payment`, {
//         customerId: selectedCustomer.customerId,
//         paidAmountId: editingPayment._id,
//         amount: parseFloat(editAmount),
//         date: editDate,
//       });

//       if (response.data.success) {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Payment details updated successfully!",
//         });
//         setShowEditModal(false);

//         const historyResponse = await axios.get(
//           `${URL}/customer/paid-amounts/${selectedCustomer.customerId}`
//         );
//         setPaymentHistory(historyResponse.data.paidAmounts);
//       } else {
//         throw new Error(response.data.message || "Failed to update payment");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Error updating payment: " + error.response?.data?.message,
//       });
//     }
//   };

//   const totalReceived = paymentHistory
//     .filter((entry) => entry.isGet)
//     .reduce((sum, entry) => sum + entry.amount, 0);

//   const totalNotReceived = paymentHistory
//     .filter((entry) => !entry.isGet)
//     .reduce((sum, entry) => sum + entry.amount, 0);

//   // ✅ FULL FIELD FILTER
//   const term = searchTerm.toLowerCase();
//   const filteredGrouped = {};
//   Object.entries(groupedCustomers).forEach(([routeNo, custList]) => {
//     const filtered = custList.filter((c) => {
//       const status =
//         c.paidAmounts.length === 0
//           ? "No Payments"
//           : c.paidAmounts.some((am) => !am.isGet)
//           ? "Unpaid"
//           : "Paid";

//       return (
//         (c.customerId &&
//           c.customerId.toString().toLowerCase().includes(term)) ||
//         (c.name && c.name.toLowerCase().includes(term)) ||
//         (c.phone && c.phone.toLowerCase().includes(term)) ||
//         (c.address &&
//           c.address.some((a) =>
//             `${a.streetAddress} ${a.apartment} ${a.postcode}`
//               .toLowerCase()
//               .includes(term)
//           )) ||
//         status.toLowerCase().includes(term)
//       );
//     });
//     if (filtered.length > 0) {
//       filteredGrouped[routeNo] = filtered;
//     }
//   });

//   return (
//     <div style={{ overflowX: "auto" }}>
//       {Object.keys(filteredGrouped).length > 0 ? (
//         Object.entries(filteredGrouped).map(([routeNo, custList]) => (
//           <div key={routeNo}>
//             <b>Route No: {routeNo}</b>
//             <Table className="table table-dashed table-hover table-striped">
//               <thead>
//                 <tr>
//                   <th>Customer Id</th>
//                   <th>Name</th>
//                   <th>Phone</th>
//                   <th>Address</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {custList.map((data) => {
//                   const status =
//                     data.paidAmounts.length === 0
//                       ? "No Payments"
//                       : data.paidAmounts.some((am) => !am.isGet)
//                       ? "Unpaid"
//                       : "Paid";
//                   return (
//                     <tr key={data._id}>
//                       <td>{data.customerId}</td>
//                       <td>
//                         <Link to="#">{data.name}</Link>
//                       </td>
//                       <td>{data.phone}</td>
//                       <td>
//                         {data.address.map((addr, index) => (
//                           <div key={index}>
//                             {addr.streetAddress}, {addr.apartment},{" "}
//                             {addr.postcode}
//                           </div>
//                         ))}
//                       </td>
//                       <td>{status}</td>
//                       <td>
//                         <Button
//                           variant="primary"
//                           size="sm"
//                           onClick={() => handlePaymentClick(data)}
//                           style={{ marginRight: "5px" }}
//                         >
//                           Do Payment
//                         </Button>
//                         <Button
//                           variant="success"
//                           size="sm"
//                           onClick={() =>
//                             handlePaymentHistoryClick(data.customerId)
//                           }
//                         >
//                           Payment History
//                         </Button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//             <br />
//           </div>
//         ))
//       ) : (
//         <p>No customers found for the entered search term.</p>
//       )}

//       {/* Payment Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Payment for {selectedCustomer?.name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group>
//             <Form.Label>Enter Payment Amount</Form.Label>
//             <Form.Control
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Enter amount"
//             />
//           </Form.Group>
//           <Form.Group>
//             <Form.Label>Select Payment Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={paymentDate}
//               onChange={(e) => setPaymentDate(e.target.value)}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="success" onClick={handleAddPayment}>
//             Add Payment
//           </Button>
//           {isConfirming && (
//             <Button variant="warning" onClick={handleConfirmPayment}>
//               Confirm Payment
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>

//       {/* Payment History Modal */}
//       <Modal
//         show={showHistoryModal}
//         onHide={() => setShowHistoryModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title style={{ color: "white" }}>
//             Payment History for {selectedCustomer?.name}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {paymentHistory.length > 0 ? (
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paymentHistory.map((payment) => (
//                   <>
//                     <tr key={payment._id}>
//                       <td>{new Date(payment.date).toLocaleDateString()}</td>
//                       <td>{payment.amount}</td>
//                       <td>
//                         {payment.isGet ? (
//                           <span className="text-success">Paid</span>
//                         ) : (
//                           <>
//                             <span className="text-danger">Unpaid</span>
//                             <Button
//                               variant="warning"
//                               size="sm"
//                               className="ms-2"
//                               onClick={() =>
//                                 handleHistoryPaymentConfirmation(payment._id)
//                               }
//                             >
//                               Confirm
//                             </Button>
//                           </>
//                         )}
//                       </td>
//                       <td>
//                         <Button
//                           size="sm"
//                           onClick={() => handleEditClick(payment)}
//                         >
//                           <i className="fa fa-edit"></i>
//                         </Button>
//                       </td>
//                     </tr>
//                   </>
//                 ))}
//               </tbody>
//             </Table>
//           ) : (
//             <p>No payment history available.</p>
//           )}
//           <ul style={{ display: "flex", justifyContent: "center", gap: 16 }}>
//             <li>
//               Paid Amount: <span>{totalReceived}</span>
//             </li>
//             <li>
//               Unpaid Amount: <span>{totalNotReceived}</span>
//             </li>
//           </ul>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowHistoryModal(false)}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Edit Payment Modal */}
//       <Modal
//         show={showEditModal}
//         onHide={() => setShowEditModal(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Edit Payment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Group className="mb-3">
//             <Form.Label>Edit Amount</Form.Label>
//             <Form.Control
//               type="number"
//               value={editAmount}
//               onChange={(e) => setEditAmount(e.target.value)}
//               placeholder="Enter amount"
//             />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Edit Date</Form.Label>
//             <Form.Control
//               type="date"
//               value={editDate}
//               onChange={(e) => setEditDate(e.target.value)}
//             />
//           </Form.Group>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowEditModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSaveEdit}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AllCustomerTable;




import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { FetchCustomer, URL } from "../../Helper/handle-api";
import axios from "axios";
import Swal from "sweetalert2";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [paymentForms, setPaymentForms] = useState({});

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
      if (!acc[routeKey]) acc[routeKey] = [];
      acc[routeKey].push(customer);
      return acc;
    }, {});
    setGroupedCustomers(grouped);
  };

  const handleAddPayment = async (customer) => {
    const form = paymentForms[customer.customerId] || {};
    const { amount, date } = form;

    if (!amount || parseFloat(amount) <= 0 || !date) {
      Swal.fire("Error", "Enter valid amount and date", "error");
      return;
    }

    const res = await axios.post(`${URL}/customer/add-paid-amount/customer`, {
      customerId: customer.customerId,
      amount: parseFloat(amount),
      date,
    });

    await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
      customerId: customer.customerId,
      paidAmountId: res.data.paidAmount._id,
    });

    Swal.fire("Success", "Payment added & confirmed!", "success");

    const updated = await axios.get(
      `${URL}/customer/paid-amounts/${customer.customerId}`
    );

    setPaymentForms((prev) => ({
      ...prev,
      [customer.customerId]: {
        payments: updated.data.paidAmounts,
        amount: "",
        date: "",
      },
    }));
  };

  const handleConfirmUnpaid = async (customerId, paymentId) => {
    await axios.patch(`${URL}/customer/confirm-paid-amount/confirm`, {
      customerId,
      paidAmountId: paymentId,
    });
    Swal.fire("Success", "Payment confirmed!", "success");

    const updated = await axios.get(`${URL}/customer/paid-amounts/${customerId}`);
    setPaymentForms((prev) => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        payments: updated.data.paidAmounts,
      },
    }));
  };

  const handlePaymentChange = (customerId, field, value) => {
    setPaymentForms((prev) => ({
      ...prev,
      [customerId]: {
        ...prev[customerId],
        [field]: value,
      },
    }));
  };

  const term = searchTerm.toLowerCase();
  const filteredGrouped = {};
  Object.entries(groupedCustomers).forEach(([routeNo, custList]) => {
    const filtered = custList.filter((c) => {
      const status =
        !c.paidAmounts || c.paidAmounts.length === 0
          ? "No Payments"
          : c.paidAmounts.some((am) => !am.isGet)
          ? "Unpaid"
          : "Paid";

      return (
        c.customerId?.toString().toLowerCase().includes(term) ||
        c.name?.toLowerCase().includes(term) ||
        c.phone?.toLowerCase().includes(term) ||
        c.address?.some((a) =>
          `${a.streetAddress} ${a.apartment} ${a.postcode}`
            .toLowerCase()
            .includes(term)
        ) ||
        status.toLowerCase().includes(term)
      );
    });
    if (filtered.length > 0) {
      filteredGrouped[routeNo] = filtered;
    }
  });

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.entries(filteredGrouped).map(([routeNo, custList]) => (
        <div key={routeNo}>
          <h5>Route No: {routeNo}</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Paid</th>
                <th>Unpaid</th>
                <th>Payments</th>
                <th>Add Payment</th>
              </tr>
            </thead>
            <tbody>
              {custList.map((c) => {
                const form = paymentForms[c.customerId] || {};
                const payments = Array.isArray(form.payments)
                  ? form.payments
                  : Array.isArray(c.paidAmounts)
                  ? c.paidAmounts
                  : [];

                const totalPaid = payments
                  .filter((p) => p.isGet)
                  .reduce((s, p) => s + p.amount, 0);
                const totalUnpaid = payments
                  .filter((p) => !p.isGet)
                  .reduce((s, p) => s + p.amount, 0);

                return (
                  <React.Fragment key={c._id}>
                    <tr>
                      <td>{c.customerId}</td>
                      <td>{c.name}</td>
                      <td>{c.phone}</td>
                      <td>
                        {c.address.map((a, i) => (
                          <div key={i}>
                            {a.streetAddress},{a.apartment},{a.postcode}
                          </div>
                        ))}
                      </td>
                      <td>{totalPaid}</td>
                      <td>{totalUnpaid}</td>
                      <td>
                        {payments.length > 0 ? (
                          <Table bordered size="sm">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {payments.map((p) => (
                                <tr key={p._id}>
                                  <td>
                                    {new Date(p.date).toLocaleDateString()}
                                  </td>
                                  <td>{p.amount}</td>
                                  <td>
                                    {p.isGet ? (
                                      <span style={{ color: "green" }}>
                                        Paid
                                      </span>
                                    ) : (
                                      <span style={{ color: "red" }}>
                                        Unpaid
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    {!p.isGet && (
                                      <Button
                                        size="sm"
                                        variant="warning"
                                        onClick={() =>
                                          handleConfirmUnpaid(
                                            c.customerId,
                                            p._id
                                          )
                                        }
                                      >
                                        Confirm
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <p>No Payments</p>
                        )}
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          placeholder="Amount"
                          value={form.amount || ""}
                          onChange={(e) =>
                            handlePaymentChange(
                              c.customerId,
                              "amount",
                              e.target.value
                            )
                          }
                          style={{ marginBottom: 4 }}
                        />
                        <Form.Control
                          type="date"
                          value={form.date || ""}
                          onChange={(e) =>
                            handlePaymentChange(
                              c.customerId,
                              "date",
                              e.target.value
                            )
                          }
                          style={{ marginBottom: 4 }}
                        />
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAddPayment(c)}
                        >
                          Add Payment
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default AllCustomerTable;
