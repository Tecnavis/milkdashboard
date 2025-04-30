// import { useEffect, useState } from "react";
// import axios from "axios";
// import { URL } from "../../Helper/handle-api";

// const ReservedEvents = () => {
//   const [quantities, setQuantities] = useState({});

//   useEffect(() => {
//     const fetchTodayOrders = async () => {
//       try {
//         const response = await axios.get(`${URL}/orderdetails`);
//         const orders = response.data;

//         // Get today's date in YYYY-MM-DD format
//         const today = new Date().toISOString().split("T")[0];

//         // Filter orders where selectedPlanDetails.dates include today's date
//         const todayOrders = orders.filter(order =>
//           order.selectedPlanDetails?.dates.some(dateEntry =>
//             dateEntry.date.startsWith(today)
//           )
//         );

//         // Count total quantities of each product size
//         const quantityCount = {};

//         todayOrders.forEach(order => {
//           order.productItems.forEach(item => {
//             const productSize = item.product?.quantity; // e.g., "200ML"
//             const quantity = item.quantity; // Quantity ordered

//             if (productSize) {
//               quantityCount[productSize] = (quantityCount[productSize] || 0) + quantity;
//             }
//           });
//         });

//         setQuantities(quantityCount);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchTodayOrders();
//   }, []);

//   return (
//     <div className="panel mb-30">
//       <div className="panel-header">
//         <h5>Today's Orders</h5>
//       </div>
//       <div className="panel-body">
//         <div id="external-events" className="sidebar-event-list">
//           {Object.entries(quantities).length === 0 ? (
//             <p>No orders for today.</p>
//           ) : (
//             Object.entries(quantities).map(([size, count]) => (
//               <div key={size} className="fc-event">
//                 Quantity {size} ({count})
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };



import { useEffect, useState } from "react";
import axios from "axios";
import { URL } from "../../Helper/handle-api";

const ReservedEvents = () => {
  const [totalQuantities, setTotalQuantities] = useState({});
  const [totalLiters, setTotalLiters] = useState(0);

  useEffect(() => {
    const fetchToDayOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails/today-orders/routes`);
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

    fetchToDayOrders();
  }, []);

  const sortedKeys = Object.keys(totalQuantities).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    return numA - numB;
  });

  return (
    <div className="panel">
      <div className="panel-header">
        <h5>Today's Orders</h5>
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
            <p>No orders for today.</p>
)}
          <p className="fc-event">
            <strong>Total Liters: </strong> {totalLiters} L
          </p>
        </div>
      </div>
    </div>
  );
};
export default ReservedEvents;