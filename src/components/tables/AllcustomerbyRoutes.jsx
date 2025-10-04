// import React, { useEffect, useState } from "react";
// import { Table, Button, Form, Row, Col, Badge } from "react-bootstrap";
// import axios from "axios";
// import Swal from "sweetalert2";
// import InvoiceModal from "./invoicemodal";
// import { fetchRoutes, URL } from "../../Helper/handle-api";

// const AllCustomerTable = ({ searchTerm }) => {
//   const [customers, setCustomers] = useState([]);
//   const [groupedCustomers, setGroupedCustomers] = useState({});
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (0-indexed)
//   const [routeTotals, setRouteTotals] = useState({});
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [paymentForms, setPaymentForms] = useState({});
//   const [invoices, setInvoices] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [selectedRoutes, setSelectedRoutes] = useState(null);
//   const [selectedStatus, setSelectedStatus] = useState(null);
//   const [ selectedCustomer ,setSelectedCustomer] = useState(null);
//   const [payValue , setPayValue] = useState('');

//   // Month names for display
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const status = ["un paid", "not close", "paid"];

//   const FetchInvoice = async () => {
//     const monthStart = new Date(selectedYear, selectedMonth, 1);

//     try {
//       const response = await axios.get(`${URL}/invoice/date/${monthStart}`);

//       setInvoices(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {

//     FetchInvoice();

//     const fetchAllRoutes = async () => {
//       try {
//         const response = await fetchRoutes();

//         // Make sure to handle both cases if response.routes exists or response is an array.
//         setRoutes(
//           response?.routes || (Array.isArray(response) ? response : [])
//         );
//       } catch (err) {
//         console.error("Error fetching routes:", err);
//       }
//     };
//     fetchAllRoutes();
//   }, [selectedYear, selectedMonth]);

//   const handleMonthChange = (e) => {
//     const selected = parseInt(e.target.value, 10);
//     setSelectedMonth(selected);
//   };

//   const availableYears = Array.from(
//     { length: 10 },
//     (_, i) => new Date().getFullYear() + 5 - i
//   );

//   const filterInvoce = invoices.filter((val) => {
//     const matchesSearch =
//       !searchTerm ||
//       val?.customerId?.customerId?.toLowerCase() === searchTerm.toLowerCase() ||
//       val?.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       val?.customerId?.email
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       val?.customerId?.phone
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       val?.customerId?.routeName
//         ?.toLowerCase()
//         .includes(searchTerm.toLowerCase());

//     const matchesRoute =
//       !selectedRoutes || val?.customerId?.routeno === selectedRoutes;

//     const matchesStatus = !selectedStatus || val?.status === selectedStatus;

//     return matchesSearch && matchesRoute && matchesStatus;
//   });

//   const handleUpdateStatus = (id) => {    
//     try {
//       const monthStart = new Date(selectedYear, selectedMonth, 1);
//       axios.patch(`${URL}/invoice/status/${id}`, { monthStart });
//         FetchInvoice();
//     } catch (error) {console.error(error)}
//   };


//   const handlePay = async(id) => {

//     try {
      
//       const monthStart = new Date(selectedYear, selectedMonth, 1);

//   await axios.patch(`${URL}/invoice/${id}`, {
//     amount: Number(payValue),
//     date: monthStart
//   })
//   setPayValue("");
//       FetchInvoice();

//     } catch (error) {
//       console.error(error);
      
//     }
//   }

//   return (
//     <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw" }}>
//       {/* Year/Month Filter */}
//       <Row className="mb-3">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Year</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedYear}
//               onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//               style={{ cursor: "pointer" }}
//             >
//               {availableYears.map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Month</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedMonth}
//               onChange={handleMonthChange}
//               style={{ cursor: "pointer" }}
//             >
//               {months.map((month, index) => (
//                 <option key={index} value={index}>
//                   {month}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Routes</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedRoutes || ""}
//               onChange={(e) => setSelectedRoutes(e.target.value)}
//               style={{ cursor: "pointer" }}
//             >
//               <option value="">All Routes</option>
//               {routes.map((route) => (
//                 <option key={route._id} value={route?.name}>
//                   {route?.name}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label>Select Status</Form.Label>
//             <Form.Control
//               as="select"
//               value={selectedStatus || ""}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               style={{ cursor: "pointer" }}
//             >
//               <option value="">All Status</option>
//               {status.map((s, index) => (
//                 <option key={index} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//         </Col>
//         <Col md={6} className="d-flex align-items-end">
//           <div>
//             <strong>
//               Showing: {months[selectedMonth]} {selectedYear}
//             </strong>
//           </div>
//         </Col>
//       </Row>

//       {/* Customer Tables */}

//       <div style={{ marginBottom: "2rem" }}>
//         <div
//           style={{
//             overflowX: "auto",
//             border: "1px solid #dee2e6",
//             borderRadius: "0.375rem",
//           }}
//         >
//           <Table bordered style={{ minWidth: "1200px", margin: 0 }}>
//             <thead style={{ backgroundColor: "#e9ecef" }}>
//               <tr>
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Phone</th>
//                 <th>Address</th>
//                 <th>Monthly Total</th>
//                 <th>Monthly Paid</th>
//                 <th>Monthly Get Balance</th>
//                 <th>Monthly Pay Balance</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//                 <th>Add Payment</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filterInvoce.map((c) => {
//                 return (
//                   <tr key={c._id}>
//                     <td
//                       style={{ cursor: "pointer" }}
//                       onClick={() => {
//                         setSelectedCustomerId(c?.customerId?._id);
//                         setSelectedCustomer(c?.customerId)
//                         setShowInvoiceModal(true);
//                       }}
//                     >
//                       {c?.customerId?.customerId}
//                     </td>
//                     <td>{c?.customerId?.name}</td>
//                     <td>{c?.customerId?.phone}</td>
//                     <td>
//                       {c?.customerId?.address?.map((a, i) => (
//                         <div key={i} style={{ fontSize: "0.875rem" }}>
//                           {a?.streetAddress}, {a?.apartment}, {a?.postcode}
//                         </div>
//                       ))}
//                     </td>
//                     <td style={{ fontWeight: "bold" }}>₹{c.monthAmount}</td>
//                     <td style={{ color: "green", fontWeight: "bold" }}>
//                       ₹{c.getAmount}
//                     </td>
//                     <td
//                       style={{
//                         color: "green",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       ₹{c.getBalance}
//                     </td>
//                     <td
//                       style={{
//                         color: "green",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       ₹{c.payBalance}
//                     </td>
//                     <td>
//                       <Badge
//                         bg={
//                           c.status == "paid"
//                             ? "success"
//                             : c.status == "un paid"
//                             ? "danger"
//                             : c.status == "not close"
//                             ? "info"
//                             : "secondary"
//                         }
//                       >
//                         {c.status}
//                       </Badge>
//                     </td>
//                     <td>
//                       {c.status == "un paid" && (
//                         <Button
//                           size="sm"
//                           variant="warning"
//                           onClick={() => handleUpdateStatus(c?.customerId?._id)}
//                         >
//                           Confirm
//                         </Button>
//                       )}
//                     </td>
//                     <td style={{display: "flex", justifyContent: "space-between", gap: 3 }}>
//                       {
//                         c.status !== "paid" &&
//                         <>
//                         <input    type="text" placeholder="Enter amount"  onChange={(e) => setPayValue(e.target.value)} />
//                       <Button   size="sm" style={{backgroundColor: "#0D99FF" }} onClick={() => handlePay(c?.customerId?._id)}>Pay</Button>
//                         </>
//                       }
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </div>
//       </div>

//       {filterInvoce.length === 0 && (
//         <div className="text-center py-5">
//           <h5>No customers found</h5>
//           <p>Try adjusting your search terms or filters</p>
//         </div>
//       )}

//       <InvoiceModal
//         show={showInvoiceModal}
//         onHide={() => setShowInvoiceModal(false)}
//         customerId={selectedCustomerId}
//         customer = {selectedCustomer}
//         URL={URL}
//       />
//     </div>
//   );
// };

// export default AllCustomerTable;


import React, { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Badge } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import InvoiceModal from "./invoicemodal";
import { fetchRoutes, URL } from "../../Helper/handle-api";

const AllCustomerTable = ({ searchTerm }) => {
  const [customers, setCustomers] = useState([]);
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [routeTotals, setRouteTotals] = useState({});
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [paymentForms, setPaymentForms] = useState({});
  const [invoices, setInvoices] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoutes, setSelectedRoutes] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [payValues, setPayValues] = useState({}); // 👈 per-invoice payment state

  // Month names
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const status = ["un paid", "not close", "paid"];

  const FetchInvoice = async () => {
    const monthStart = new Date(selectedYear, selectedMonth, 1);
    try {
      const response = await axios.get(`${URL}/invoice/date/${monthStart}`);
      setInvoices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchInvoice();
    const fetchAllRoutes = async () => {
      try {
        const response = await fetchRoutes();
        setRoutes(response?.routes || (Array.isArray(response) ? response : []));
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };
    fetchAllRoutes();
  }, [selectedYear, selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value, 10));
  };

  const availableYears = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + 5 - i
  );

  const filterInvoce = invoices.filter((val) => {
    const matchesSearch =
      !searchTerm ||
      val?.customerId?.customerId?.toLowerCase() === searchTerm.toLowerCase() ||
      val?.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val?.customerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val?.customerId?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      val?.customerId?.routeName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoute = !selectedRoutes || val?.customerId?.routeno === selectedRoutes;
    const matchesStatus = !selectedStatus || val?.status === selectedStatus;

    return matchesSearch && matchesRoute && matchesStatus;
  });

  const handleUpdateStatus = async (invoiceId) => {
    try {
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      await axios.patch(`${URL}/invoice/status/${invoiceId}`, { monthStart });
      FetchInvoice();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePay = async (invoiceId) => {
    try {
      const monthStart = new Date(selectedYear, selectedMonth, 1);
      const amount = Number(payValues[invoiceId] || 0);

      if (!amount || amount <= 0) {
        Swal.fire("Invalid amount", "Please enter a valid payment amount", "warning");
        return;
      }

      

      await axios.patch(`${URL}/invoice/${invoiceId}`, {
        amount,
        date: monthStart,
      });

      // Clear only this row’s input
      setPayValues((prev) => ({ ...prev, [invoiceId]: "" }));
      FetchInvoice();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ overflowX: "auto", width: "100%", maxWidth: "100vw" }}>
      {/* Filters */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Year</Form.Label>
            <Form.Control
              as="select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              style={{ cursor: "pointer" }}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Month</Form.Label>
            <Form.Control
              as="select"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ cursor: "pointer" }}
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Routes</Form.Label>
            <Form.Control
              as="select"
              value={selectedRoutes || ""}
              onChange={(e) => setSelectedRoutes(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">All Routes</option>
              {routes.map((route) => (
                <option key={route._id} value={route?.name}>{route?.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Select Status</Form.Label>
            <Form.Control
              as="select"
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ cursor: "pointer" }}
            >
              <option value="">All Status</option>
              {status.map((s, index) => (
                <option key={index} value={s}>{s}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={6} className="d-flex align-items-end">
          <div>
            <strong>
              Showing: {months[selectedMonth]} {selectedYear}
            </strong>
          </div>
        </Col>
      </Row>

      {/* Table */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ overflowX: "auto", border: "1px solid #dee2e6", borderRadius: "0.375rem" }}>
          <Table bordered style={{ minWidth: "1200px", margin: 0 }}>
            <thead style={{ backgroundColor: "#e9ecef" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Monthly Total</th>
                <th>Monthly Paid</th>
                <th>Monthly Get Balance</th>
                <th>Monthly Pay Balance</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Add Payment</th>
              </tr>
            </thead>
            <tbody>
              {filterInvoce.map((c) => (
                <tr key={c._id}>
                  <td
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedCustomerId(c?.customerId?._id);
                      setSelectedCustomer(c?.customerId);
                      setShowInvoiceModal(true);
                    }}
                  >
                    {c?.customerId?.customerId}
                  </td>
                  <td>{c?.customerId?.name}</td>
                  <td>{c?.customerId?.phone}</td>
                  <td>
                    {c?.customerId?.address?.map((a, i) => (
                      <div key={i} style={{ fontSize: "0.875rem" }}>
                        {a?.streetAddress}, {a?.apartment}, {a?.postcode}
                      </div>
                    ))}
                  </td>
                  <td style={{ fontWeight: "bold" }}>₹{c.monthAmount}</td>
                  <td style={{ color: "green", fontWeight: "bold" }}>₹{c.getAmount}</td>
                  <td style={{ color: "green", fontWeight: "bold" }}>₹{c.getBalance}</td>
                  <td style={{ color: "green", fontWeight: "bold" }}>₹{c.payBalance}</td>
                  <td>
                    <Badge
                      bg={
                        c.status === "paid"
                          ? "success"
                          : c.status === "un paid"
                          ? "danger"
                          : c.status === "not close"
                          ? "info"
                          : "secondary"
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td>
                    {c.status === "un paid" ||  c.status === "not close" && (
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={() => handleUpdateStatus(c?.customerId?._id)}
                      >
                        Confirm
                      </Button>
                    )}
                  </td>
                  <td style={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
                    {c.status !== "paid" && (
                      <>
                        <input
                          type="text"
                          placeholder="Enter amount"
                          value={payValues[c?.customerId?._id] || ""}
                          onChange={(e) =>
                            setPayValues({ ...payValues, [c?.customerId?._id]: e.target.value })
                          }
                        />
                        <Button
                          size="sm"
                          style={{ backgroundColor: "#0D99FF" }}
                          onClick={() => handlePay(c?.customerId?._id)}
                        >
                          Pay
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {filterInvoce.length === 0 && (
        <div className="text-center py-5">
          <h5>No customers found</h5>
          <p>Try adjusting your search terms or filters</p>
        </div>
      )}

      <InvoiceModal
        show={showInvoiceModal}
        onHide={() => setShowInvoiceModal(false)}
        customerId={selectedCustomerId}
        customer={selectedCustomer}
        URL={URL}
      />
    </div>
  );
};

export default AllCustomerTable;

