// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { URL } from "../../Helper/handle-api";

// const UpcomingEvents = () => {
//   const [nextDayOrders, setNextDayOrders] = useState([]);
//   const [totalLiters, setTotalLiters] = useState(0);

//   useEffect(() => {
//     const fetchNextDayOrders = async () => {
//       try {
//         const response = await axios.get(`${URL}/orderdetails`);
//         const orders = response.data;

//         // Get next day's date in YYYY-MM-DD format
//         const today = new Date();
//         const nextDay = new Date(today);
//         nextDay.setDate(today.getDate() + 1);
//         const nextDayISO = nextDay.toISOString().split("T")[0];

//         // Filter orders for the next day
//         const filteredOrders = orders.filter((order) =>
//           order.selectedPlanDetails?.dates?.some(
//             (dateEntry) => dateEntry.date.startsWith(nextDayISO)
//           )
//         );

//         // Group and count quantities
//         const quantityMap = {};
//         let totalLiters = 0;

//         filteredOrders.forEach((order) => {
//           order.productItems.forEach((item) => {
//             const quantityStr = item.product?.quantity;
//             if (quantityStr) {
//               // Extract numeric value from quantity (e.g., "200ML" → 200)
//               const numericQuantity = parseInt(quantityStr.replace(/\D/g, ""), 10);
              
//               // Convert to liters
//               const liters = numericQuantity / 1000;
              
//               // Add to total liters
//               totalLiters += liters * item.quantity;

//               // Store quantity count
//               quantityMap[quantityStr] = (quantityMap[quantityStr] || 0) + item.quantity;
//             }
//           });
//         });

//         // Convert to array format
//         const groupedOrders = Object.entries(quantityMap).map(([quantity, count]) => ({
//           quantity,
//           count,
//         }));

//         setNextDayOrders(groupedOrders);
//         setTotalLiters(totalLiters.toFixed(2)); // Round to 2 decimal places
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchNextDayOrders();
//   }, []);

//   return (
//     <div className="panel">
//       <div className="panel-header">
//         <h5>Tomorrow's Orders</h5>
//       </div>
//       <div className="panel-body">
//         <div className="upcoming-event-list sidebar-event-list">
//           {nextDayOrders.length > 0 ? (
//             nextDayOrders.map((order, index) => (
//               <div key={index} className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable">
//                 <div className="fc-content">
//                   <span className="fc-title">
//                     Quantity {order.quantity} ({order.count})
//                   </span>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p>No orders for tomorrow</p>
//           )}
//           <p className="fc-event"><strong>Total Liters:</strong> {totalLiters} L</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpcomingEvents;



import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

const UpcomingEvents = () => {
  const [totalQuantities, setTotalQuantities] = useState({});
  const [totalLiters, setTotalLiters] = useState(0);

  useEffect(() => {
    const fetchNextDayOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails/tomorrow-orders/routes`);
        const data = response.data;

        const allQuantities = {};
        let liters = 0;

        for (let location in data.data) {
          const sections = data.data[location];

          for (let type in sections) {
            const section = sections[type];
            liters += section.totalLiters;

            const quantities = section.quantities;
            for (let size in quantities) {
              const normalizedKey = size.toUpperCase().replace(/\s+/g, ''); // Normalize: '300 ML' => '300ML'
              allQuantities[normalizedKey] = (allQuantities[normalizedKey] || 0) + quantities[size];
            }
          }
        }

        setTotalQuantities(allQuantities);
        setTotalLiters(parseFloat(liters.toFixed(2)));
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchNextDayOrders();
  }, []);

  const sortedKeys = Object.keys(totalQuantities).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Tomorrow's Orders</h5>
      </div>
      <div className="panel-body">
        <div className="upcoming-event-list sidebar-event-list">
          {sortedKeys.length > 0 ? (
            sortedKeys.map((key) => (
              <div
                key={key}
                className="fc-day-grid-event fc-h-event fc-event fc-start fc-end fc-draggable"
              >
                <div className="fc-content">
                  <span className="fc-title">
                    {key.slice(0, -2)} ML: {totalQuantities[key]}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No orders for tomorrow</p>
          )}
          <p className="fc-event">
            <strong>Total Liters: </strong> {totalLiters} L
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
