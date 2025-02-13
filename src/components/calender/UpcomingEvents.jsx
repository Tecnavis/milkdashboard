import React, { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

const UpcomingEvents = () => {
  const [nextDayOrders, setNextDayOrders] = useState([]);

  useEffect(() => {
    const fetchNextDayOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails`);
        const orders = response.data;

        // Get next day's date in YYYY-MM-DD format
        const today = new Date();
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + 1);
        const nextDayISO = nextDay.toISOString().split("T")[0];

        // Filter orders for the next day
        const filteredOrders = orders.filter((order) =>
          order.selectedPlanDetails?.dates?.some(
            (dateEntry) => dateEntry.date.startsWith(nextDayISO)
          )
        );

        // Group and count quantities
        const quantityMap = {};
        filteredOrders.forEach((order) => {
          order.productItems.forEach((item) => {
            const quantity = item.product?.quantity;
            if (quantity) {
              quantityMap[quantity] = (quantityMap[quantity] || 0) + item.quantity;
            }
          });
        });

        // Convert to array format
        const groupedOrders = Object.entries(quantityMap).map(([quantity, count]) => ({
          quantity,
          count,
        }));

        setNextDayOrders(groupedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchNextDayOrders();
  }, []);

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Tomorrow 's Orders</h5>
      </div>
      <div className="panel-body">
        <div className="upcoming-event-list sidebar-event-list">
          {nextDayOrders.length > 0 ? (
            nextDayOrders.map((order, index) => (
              <div key={index} className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable">
                <div className="fc-content">
                  <span className="fc-title">
                    Quantity {order.quantity} ({order.count})
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No orders for tomorrow</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
