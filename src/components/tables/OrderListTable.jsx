import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { fetchAllOrders } from '../../Helper/handle-api';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import PaginationSection from './PaginationSection';

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

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Filter orders for today's date based on plan type
    const filteredOrders = orders.map(order => {
        if (order.selectedPlanDetails?.dates) {
            const todayPlan = order.selectedPlanDetails.dates.find(d => d.date.split('T')[0] === today);

            // Check for both "monthly" and "custom" plans
            if ((order.plan.planType === 'monthly' || order.plan.planType === 'custom' || order.plan.planType === 'daily'|| order.plan.planType === 'weekly'||order.plan.planType === 'alternative') && todayPlan) {
                return { ...order, selectedPlanDetails: { ...order.selectedPlanDetails, dates: [todayPlan] } };
            }
        }
        return null;
    }).filter(order => order !== null);

    // Pagination logic
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredOrders.slice(indexOfFirstData, indexOfLastData);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <OverlayScrollbarsComponent>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer Name</th>
                            <th>Route</th>
                            <th>Address</th>
                            <th>Product</th>
                            <th>Total Price</th>
                            <th>Plan Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1}</td>
                                    <td>{order.customer?.name}</td>
                                    <td>{order.customer?.routeno}</td>
                                    <td>
                                        {order.address?.streetAddress}<br/>
                                        {order.address?.postcode}<br/>
                                        {order.address?.apartment}<br/>
                                    </td>
                                    <td>{order.productItems?.product?.category}({order.productItems.quantity})</td>
                                    <td>{order.routeprice}</td>
                                    <td>{order.plan?.planType}</td>
                                    <td>{order.selectedPlanDetails.dates[0].status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">No orders found for today.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
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
