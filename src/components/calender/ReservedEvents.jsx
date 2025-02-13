import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Helper/handle-api"; // Ensure URL is correctly defined

const ReservedEvents = () => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails`);
        const orders = response.data;
        
        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        const quantityCount = {};

        orders.forEach((order) => {
          order.selectedPlanDetails?.dates?.forEach((dateEntry) => {
            if (dateEntry.date.startsWith(today)) {
              order.productItems.forEach((item) => {
                const quantity = item.product?.quantity;
                if (quantity) {
                  quantityCount[quantity] = (quantityCount[quantity] || 0) + 1;
                }
              });
            }
          });
        });

        setQuantities(quantityCount);
      } catch (error) {
        console.error("Error fetching today's orders:", error);
      }
    };

    fetchTodayOrders();
  }, []);

  return (
    <div className="panel mb-30">
      <div className="panel-header">
        <h5>Total quantity Orders Of Today</h5>
      </div>
      <div className="panel-body">
        <div id="external-events" className="sidebar-event-list">
          {Object.entries(quantities).map(([quantity, count]) => (
            <div key={quantity} className="fc-event">
              Quantity {quantity} ({count})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservedEvents;
