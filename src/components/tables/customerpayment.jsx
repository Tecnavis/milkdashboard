// import React, { useEffect, useState } from "react";
// import { Table, Modal, Button, Form } from "react-bootstrap";
// import { FetchCustomer, deleteCustomer, URL } from "../../Helper/handle-api";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";

// const AllCustomerTable = ({ searchTerm }) => {
//   const [customers, setCustomers] = useState([]);
//   const [groupedCustomers, setGroupedCustomers] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [customerIndex, setCustomerIndex] = useState("");

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

//   const updateCustomerIndexes = async (updatedCustomers) => {
//     try {
//       await Promise.all(
//         updatedCustomers.map((customer, index) =>
//           fetch(`${URL}/customer/update-customer-index/${customer.customerId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ customerindex: index + 1 }),
//           })
//         )
//       );
//       Swal.fire("Success!", "Customer index updated successfully.", "success");
//     } catch (error) {
//       console.error("Error updating customer index:", error);
//       Swal.fire("Error!", "Failed to update customer index.", "error");
//     }
//   };

//   const swapCustomers = (routeNo, index1, index2) => {
//     const updatedCustomers = [...groupedCustomers[routeNo]];
//     [updatedCustomers[index1], updatedCustomers[index2]] = [
//       updatedCustomers[index2],
//       updatedCustomers[index1],
//     ];

//     updatedCustomers.forEach((customer, index) => {
//       customer.customerindex = index + 1;
//     });

//     setGroupedCustomers({ ...groupedCustomers, [routeNo]: updatedCustomers });
//     updateCustomerIndexes(updatedCustomers);
//   };

//   const filteredRoutes = Object.keys(groupedCustomers).filter((routeNo) =>
//     routeNo.toLowerCase().includes(searchTerm.toLowerCase())
//   );


//   // const filteredRoutes = customers.filter( customer => {
//   //   customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   customer.customerindex?.includes(searchTerm) ||
//   //   customer.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   customer.routeno?.toLowerCase().includes(searchTerm.toLowerCase())
//   // })

  


//   return (
//     <div style={{ overflowX: "auto" }}>
//       {filteredRoutes.length > 0 ? (
//         filteredRoutes.map((routeNo) => (
//           <div key={routeNo}>
//             <b>Route No: {routeNo}</b>
//             <Table className="table table-dashed table-hover digi-dataTable all-product-table table-striped">
//               <thead>
//                 <tr>
//                   <th>Customer Id</th>
//                   <th>Customerindex</th>
//                   <th>Name</th>
//                   <th>Address</th>
//                   <th>Location</th>
//                   <th>Route Name</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {groupedCustomers[routeNo].map((data, index) => (
//                   <tr key={data._id}>
//                     <td>{data.customerId}</td>
//                     <td>{data.customerindex || "N/A"}</td>
//                     <td>
//                       <Link to="#">{data.name}</Link>
//                     </td>
//                     <td>
//                       {data.address.map((addr, i) => (
//                         <div key={i}>
//                           {addr.streetAddress}, {addr.apartment}, {addr.postcode}
//                         </div>
//                       ))}
//                     </td>
//                     <td>
//                       <a
//                         href={`https://www.google.com/maps?q=${encodeURIComponent(
//                           data.location
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         Location
//                       </a>
//                     </td>
//                     <td>{data.routename}</td>
//                     <td>
//                       <div className="btn-box">
//                         {/* <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//                           Update Index
//                         </button> */}
//                         <button onClick={() => deleteCustomer(data._id)}>
//                           <i className="fa-light fa-trash"></i>
//                         </button>
//                         <button
//                           className="btn btn-secondary"
//                           disabled={index === 0}
//                           onClick={() => swapCustomers(routeNo, index, index - 1)}
//                         >
//                           ↑
//                         </button>
//                         <button
//                           className="btn btn-secondary"
//                           disabled={index === groupedCustomers[routeNo].length - 1}
//                           onClick={() => swapCustomers(routeNo, index, index + 1)}
//                         >
//                           ↓
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//             <br />
//           </div>
//         ))
//       ) : (
//         <p>No customers found for the entered route number.</p>
//       )}

//       {/* Modal for Updating Customer Index */}
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Customer Index</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Customer Index</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={customerIndex}
//                 onChange={(e) => setCustomerIndex(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => updateCustomerIndexes([{ ...selectedCustomer, customerindex }])}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default AllCustomerTable;


// import React, { useEffect, useState } from "react";
// import { Table } from "react-bootstrap";
// import { FetchCustomer, deleteCustomer, URL } from "../../Helper/handle-api";
// import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "react-beautiful-dnd";

// const AllCustomerTable = ({ searchTerm }) => {
//   const [customers, setCustomers] = useState([]);
//   const [groupedCustomers, setGroupedCustomers] = useState({});

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

//   const updateCustomerIndexes = async (updatedCustomers) => {
//     try {
//       await Promise.all(
//         updatedCustomers.map((customer, index) =>
//           fetch(`${URL}/customer/update-customer-index/${customer.customerId}`, {
//             method: "PUT",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ customerindex: index + 1 }),
//           })
//         )
//       );
//       Swal.fire("Success!", "Customer index updated successfully.", "success");
//     } catch (error) {
//       console.error("Error updating customer index:", error);
//       Swal.fire("Error!", "Failed to update customer index.", "error");
//     }
//   };

//   const onDragEnd = (result, routeNo) => {
//     if (!result.destination) return;

//     const items = Array.from(groupedCustomers[routeNo]);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);

//     // Update indexes
//     const updatedItems = items.map((customer, index) => ({
//       ...customer,
//       customerindex: index + 1,
//     }));

//     setGroupedCustomers({
//       ...groupedCustomers,
//       [routeNo]: updatedItems,
//     });

//     updateCustomerIndexes(updatedItems);
//   };

//   // ✅ Filter groups and customers by search term in any field
//   const filteredGroupedCustomers = {};
//   const term = searchTerm.toLowerCase();

//   Object.entries(groupedCustomers).forEach(([routeNo, customers]) => {
//     const filteredCustomers = customers.filter((customer) => {
//       return (
//         (customer.customerId && customer.customerId.toString().toLowerCase().includes(term)) ||
//         (customer.customerindex && customer.customerindex.toString().toLowerCase().includes(term)) ||
//         (customer.name && customer.name.toLowerCase().includes(term)) ||
//         (customer.address && customer.address.some(addr =>
//           `${addr.streetAddress} ${addr.apartment} ${addr.postcode}`.toLowerCase().includes(term)
//         )) ||
//         (routeNo && routeNo.toLowerCase().includes(term)) ||
//         (customer.routename && customer.routename.toLowerCase().includes(term))
//       );
//     });
//     if (filteredCustomers.length > 0) {
//       filteredGroupedCustomers[routeNo] = filteredCustomers;
//     }
//   });

//   const hasMatches = Object.keys(filteredGroupedCustomers).length > 0;

//   return (
//     <div style={{ overflowX: "auto" }}>
//       {hasMatches ? (
//         Object.entries(filteredGroupedCustomers).map(([routeNo, customers]) => (
//           <div key={routeNo} style={{ marginBottom: "2rem" }}>
//             <b>Route No: {routeNo}</b>
//             <DragDropContext
//               onDragEnd={(result) => onDragEnd(result, routeNo)}
//             >
//               <Droppable droppableId={routeNo}>
//                 {(provided) => (
//                   <Table
//                     className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
//                     {...provided.droppableProps}
//                     ref={provided.innerRef}
//                   >
//                     <thead>
//                       <tr>
//                         <th>Customer Id</th>
//                         <th>Customerindex</th>
//                         <th>Name</th>
//                         <th>Address</th>
//                         <th>Location</th>
//                         <th>Route Name</th>
//                         <th>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {customers.map((data, index) => (
//                         <Draggable
//                           key={data._id}
//                           draggableId={data._id}
//                           index={index}
//                         >
//                           {(provided) => (
//                             <tr
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 ...provided.draggableProps.style,
//                                 cursor: "grab",
//                               }}
//                             >
//                               <td>{data.customerId}</td>
//                               <td>{data.customerindex || "N/A"}</td>
//                               <td>
//                                 <Link to="#">{data.name}</Link>
//                               </td>
//                               <td>
//                                 {data.address.map((addr, i) => (
//                                   <div key={i}>
//                                     {addr.streetAddress}, {addr.apartment},{" "}
//                                     {addr.postcode}
//                                   </div>
//                                 ))}
//                               </td>
//                               <td>
//                                 <a
//                                   href={`https://www.google.com/maps?q=${encodeURIComponent(
//                                     data.location
//                                   )}`}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                 >
//                                   Location
//                                 </a>
//                               </td>
//                               <td>{data.routename}</td>
//                               <td>
//                                 <button
//                                   className="btn btn-danger"
//                                   onClick={() => deleteCustomer(data._id)}
//                                 >
//                                   <i className="fa-light fa-trash"></i>
//                                 </button>
//                               </td>
//                             </tr>
//                           )}
//                         </Draggable>
//                       ))}
//                       {provided.placeholder}
//                     </tbody>
//                   </Table>
//                 )}
//               </Droppable>
//             </DragDropContext>
//           </div>
//         ))
//       ) : (
//         <p>No customers match your search.</p>
//       )}
//     </div>
//   );
// };

// export default AllCustomerTable;



import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FetchCustomer, deleteCustomer, URL } from "../../Helper/handle-api";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const AllCustomerTable = ({ searchTerm }) => {
  const [groupedCustomers, setGroupedCustomers] = useState({});

  // ---------- Fetch & Group ----------
  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();
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

    // Sort each route’s customers by saved index
    Object.keys(grouped).forEach((key) =>
      grouped[key].sort((a, b) => (a.customerindex ?? 0) - (b.customerindex ?? 0))
    );

    setGroupedCustomers(grouped);
  };

  // ---------- Save new indexes ----------
  const updateCustomerIndexes = async (updatedCustomers) => {
    try {
      await Promise.all(
        updatedCustomers.map((customer, index) =>
          fetch(`${URL}/customer/update-customer-index/${customer.customerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerindex: index + 1 }),
          })
        )
      );
      Swal.fire("Success!", "Customer index updated successfully.", "success");
    } catch (error) {
      console.error("Error updating customer index:", error);
      Swal.fire("Error!", "Failed to update customer index.", "error");
    }
  };

  // ---------- Drag & Drop ----------
  const onDragEnd = (result, routeNo) => {
    if (!result.destination) return;

    const items = Array.from(groupedCustomers[routeNo]);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    const updatedItems = items.map((c, i) => ({ ...c, customerindex: i + 1 }));

    setGroupedCustomers({
      ...groupedCustomers,
      [routeNo]: updatedItems,
    });

    updateCustomerIndexes(updatedItems);
  };

  // ---------- Search Filter ----------
  const term = searchTerm.toLowerCase();
  const filtered = {};
  Object.entries(groupedCustomers).forEach(([routeNo, customers]) => {
    const match = customers.filter((c) =>
      (c.customerId && c.customerId.toLowerCase().includes(term)) ||
      (c.customerindex && c.customerindex.toString().includes(term)) ||
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.address && c.address.some(a =>
        `${a.streetAddress} ${a.apartment} ${a.postcode}`.toLowerCase().includes(term)
      )) ||
      (routeNo.toLowerCase().includes(term)) ||
      (c.routename && c.routename.toLowerCase().includes(term))
    );
    if (match.length) filtered[routeNo] = match;
  });

  const groupsToRender = Object.keys(filtered).length ? filtered : {};

  return (
    <div style={{ overflowX: "auto" }}>
      {Object.keys(groupsToRender).length === 0 && <p>No customers match your search.</p>}

      {Object.entries(groupsToRender).map(([routeNo, customers]) => (
        <div key={routeNo} style={{ marginBottom: "2rem" }}>
          <b>Route No: {routeNo}</b>
          <DragDropContext onDragEnd={(r) => onDragEnd(r, routeNo)}>
            <Droppable droppableId={routeNo}>
              {(provided) => (
                <Table
                  className="table table-dashed table-hover table-striped"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <thead>
                    <tr>
                      <th>Customer Id</th>
                      <th>Customer Index</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Location</th>
                      <th>Route Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((data, index) => (
                      <Draggable key={data._id} draggableId={data._id} index={index}>
                        {(prov) => (
                          <tr
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            style={{ ...prov.draggableProps.style, cursor: "grab" }}
                          >
                            <td>{data.customerId}</td>
                            <td>{data.customerindex ?? "N/A"}</td>
                            <td><Link to="#">{data.name}</Link></td>
                            <td>
                              {data.address.map((a, i) => (
                                <div key={i}>{a.streetAddress}, {a.apartment}, {a.postcode}</div>
                              ))}
                            </td>
                            <td>
                              <a
                                href={`https://www.google.com/maps?q=${encodeURIComponent(data.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Location
                              </a>
                            </td>
                            <td>{data.routename}</td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() => deleteCustomer(data._id)}
                              >
                                <i className="fa-light fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </Table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      ))}
    </div>
  );
};

export default AllCustomerTable;
