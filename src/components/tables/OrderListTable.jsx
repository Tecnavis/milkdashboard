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




    const handleDeliveryStatus = async (orderId, date, customerId) => {
      if (!orderId || !date || !customerId) {
        console.error("Missing orderId, date, or customerId for updating status.");
        return;
      }
    
      try {
        const message = `Your product has been successfully delivered on ${date.split("T")[0]}.`;
    
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
    
          // Store the message in the database and trigger push notification
          await axios.post(`${URL}/fcm/send-notification`, {
            customerId,
            message,
          });
    
          console.log(message);
        }
      } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update delivery status. Please try again.");
      }
    };
    
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
                <th>Action</th>
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
                          {item.product?.category} ({item.quantity})<br />
                          <img
                            src={`${URL}/images/${item.product?.coverimage}`}
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

                    <td>{order.totalPrice}</td>
                    <td>{order.plan?.planType}</td>
                    <td>{order.selectedPlanDetails.dates[0].status}</td>
                    <td>
                    <button
  className={`btn btn-sm ${
    order.selectedPlanDetails.dates[0].status === "delivered"
      ? "btn-success"
      : "btn-primary"
  }`}
  onClick={() =>
    handleDeliveryStatus(order._id, order.selectedPlanDetails.dates[0].date, order.customer._id)
  }
>
  Delivered
</button>

</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No orders found for today.
                  </td>
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
