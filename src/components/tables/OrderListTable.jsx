import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { fetchAllOrders, URL } from '../../Helper/handle-api';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';
import axios from 'axios';

const OrderListTable = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage] = useState(10);

    useEffect(() => {
        const getOrders = async () => {
            const response = await fetchAllOrders();
            if (response) {
                setOrders(response);
            }
        };
        getOrders();
    }, []);

    const today = new Date().toISOString().split('T')[0];

    const filteredOrders = orders.map(order => {
        if (order && order.selectedPlanDetails?.dates && order.plan) {
            const todayPlan = order.selectedPlanDetails.dates.find(d => d.date.split('T')[0] === today);
            const planType = order.plan.planType?.toLowerCase();
            const allowedPlanTypes = ['monthly', 'custom', 'daily', 'weekly', 'alternative', 'none'];

            if (allowedPlanTypes.includes(planType) && todayPlan) {
                return { ...order, selectedPlanDetails: { ...order.selectedPlanDetails, dates: [todayPlan] } };
            }
        }
        return null;
    }).filter(order => order !== null);

    // Grouping orders by routeno
 // Grouping and sorting orders by routeno
const ordersByRoute = filteredOrders.reduce((acc, order) => {
  const routeNo = order.customer?.routeno || "Unassigned";
  if (!acc[routeNo]) acc[routeNo] = [];
  acc[routeNo].push(order);
  // Sort by customerindex in ascending order
  acc[routeNo].sort((a, b) => (a.customer?.customerindex || 0) - (b.customer?.customerindex || 0));
  return acc;
}, {});


    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleDeliveryStatus = async (orderId, date, customerId) => {
        if (!orderId || !date || !customerId) {
            console.error("Missing orderId, date, or customerId for updating status.");
            return;
        }

        try {
            const response = await axios.patch(`${URL}/orderdetails/${orderId}`, {
                status: "delivered",
                date,
            });

            if (response.status === 200) {
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? {
                                  ...order,
                                  selectedPlanDetails: {
                                      ...order.selectedPlanDetails,
                                      dates: (order.selectedPlanDetails?.dates || []).map((dateObj) =>
                                          dateObj.date === date
                                              ? { ...dateObj, status: "delivered" }
                                              : dateObj
                                      ),
                                  },
                              }
                            : order
                    )
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update delivery status. Please try again.");
        }
    };

    return (
        <div>
            <OverlayScrollbarsComponent>
                {Object.keys(ordersByRoute).map((routeNo, index) => (
                    <div key={index} style={{ marginBottom: "30px" }}>
                        <b>Route No: {routeNo}</b>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Customer Index</th>
                                    <th>Address</th>
                                    <th>Product</th>
                                    <th>Total Price</th>
                                    <th>Plan Type</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersByRoute[routeNo].map((order, idx) => (
                                    <tr key={order._id}>
                                        <td>{idx + 1}</td>
                                        <td>{order.customer?.name || "N/A"}</td>
                                        <td>{order.customer?.customerindex || "N/A"}</td>
                                        <td>
                                            {order.address?.streetAddress}
                                            <br />
                                            {order.address?.postcode}
                                            <br />
                                            {order.address?.apartment}
                                            <br />
                                        </td>
                                        <td>
                                            {order.productItems?.map((item) => (
                                                <div key={item._id}>
                                                    {item.product?.category || "N/A"} ({item.quantity || "N/A"})<br />
                                                    <img
                                                        src={`${URL}/images/${item.product?.coverimage || ""}`}
                                                        alt={item.product?.category}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </td>

                                        <td>{order.totalPrice || " "}</td>
                                        <td>{order.plan?.planType || "N/A"}</td>
                                        <td>{order.selectedPlanDetails.dates[0].status}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${
                                                    order.selectedPlanDetails.dates[0].status === "delivered"
                                                        ? "btn-success"
                                                        : "btn-primary"
                                                }`}
                                                onClick={() =>
                                                    handleDeliveryStatus(
                                                        order._id,
                                                        order.selectedPlanDetails.dates[0].date,
                                                        order.customer._id
                                                    )
                                                }
                                            >
                                                Delivered
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                ))}
            </OverlayScrollbarsComponent>

            {/* Pagination */}
            {filteredOrders.length > dataPerPage && (
                <PaginationSection
                    currentPage={currentPage}
                    dataPerPage={dataPerPage}
                    totalData={filteredOrders.length}
                    paginate={paginate}
                />
            )}
        </div>
    );
};

export default OrderListTable;
