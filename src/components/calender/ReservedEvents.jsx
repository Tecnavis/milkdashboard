import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

const ReservedEvents = () => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails`);
        const orders = response.data;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Filter orders where selectedPlanDetails.dates include today's date
        const todayOrders = orders.filter(order =>
          order.selectedPlanDetails?.dates.some(dateEntry =>
            dateEntry.date.startsWith(today)
          )
        );

        // Count total quantities of each product size
        const quantityCount = {};

        todayOrders.forEach(order => {
          order.productItems.forEach(item => {
            const productSize = item.product?.quantity; // e.g., "200ML"
            const quantity = item.quantity; // Quantity ordered

            if (productSize) {
              quantityCount[productSize] = (quantityCount[productSize] || 0) + quantity;
            }
          });
        });

        setQuantities(quantityCount);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchTodayOrders();
  }, []);

  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>Today's Orders</h5>
      </div>
      <div className="panel-body">
        <div id="external-events" className="sidebar-event-list">
          {Object.entries(quantities).length === 0 ? (
            <p>No orders for today.</p>
          ) : (
            Object.entries(quantities).map(([size, count]) => (
              <div key={size} className="fc-event">
                Quantity {size} ({count})
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservedEvents;
