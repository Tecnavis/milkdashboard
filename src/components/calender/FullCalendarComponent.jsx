// import React, { useContext, useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import axios from "axios";
// import { DigiContext } from "../../context/DigiContext";
// import { URL } from "../../Helper/handle-api";
// import Swal from "sweetalert2";

// const FullCalendarComponent = () => {
//   const { calendarRef } = useContext(DigiContext);
//   const [events, setEvents] = useState([]);

//   // Fetch all orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`${URL}/orderdetails`);
//         const orders = response.data;

//         // Transform orders into FullCalendar event format
//         const orderEvents = orders.flatMap((order) =>
//           order.selectedPlanDetails?.dates?.map((dateEntry) => ({
//             title: `${order.customer?.name} - ${order.productItems
//               .map((item) => `${item.product?.category} (${item.product?.quantity})`)
//               .join(", ")}`,
//             start: dateEntry.date, // Use order delivery date
//             allDay: true, // Full-day event
//             extendedProps: {
//               customer: order.customer?.name,
//               products: order.productItems.map((item) => ({
//                 category: item.product?.category,
//                 quantity: item.product?.quantity,
//               })),
//               status: dateEntry.status,
//             },
//           }))
//         );

//         setEvents(orderEvents);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   return (
//     <div className="col-xxl-9 col-lg-8">
//       <div className="panel">
//         <div className="panel-body">
//           <div id="calendar">
//             <FullCalendar
//               ref={calendarRef}
//               plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//               headerToolbar={{
//                 left: "prev,next today",
//                 center: "title",
//                 right: "dayGridMonth,timeGridWeek,timeGridDay",
//               }}
//               initialView="dayGridMonth"
//               editable={true}
//               selectable={true}
//               selectMirror={true}
//               dayMaxEvents={true}
//               events={events} // Set transformed orders as events
//               eventClick={(info) => {
//                 const { customer, products, status } = info.event.extendedProps;
//                 const productDetails = products
//                   .map((product) => `${product.category} (${product.quantity})`)
//                   .join(", ");
//                   Swal.fire({
//                     title: "Order Details",
//                     html: `<strong>Customer:</strong> ${customer}<br>
//                            <strong>Products:</strong> ${productDetails}<br>
//                            <strong>Status:</strong> ${status}`,
//                     icon: "info",
//                     confirmButtonText: "OK",
//                   });
//                 }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FullCalendarComponent;


import React, { useContext, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { DigiContext } from "../../context/DigiContext";
import { URL } from "../../Helper/handle-api";
import Swal from "sweetalert2";

const FullCalendarComponent = () => {
  const { calendarRef } = useContext(DigiContext);
  const [events, setEvents] = useState([]);

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${URL}/orderdetails`);
        const orders = response.data;

        // Safely transform orders into FullCalendar event format
        const orderEvents = orders
          .flatMap((order) => {
            // Check if order has the required structure
            if (!order?.selectedPlanDetails?.dates) {
              return []; // Skip invalid orders
            }

            return order.selectedPlanDetails.dates
              .filter(dateEntry => dateEntry?.date) // Filter out entries without dates
              .map((dateEntry) => ({
                id: `${order._id}-${dateEntry.date}`, // Unique ID for each event
                title: `${order.customer?.name || 'Unknown Customer'} - ${order.productItems
                  ?.map((item) => `${item.product?.category || 'Unknown'} (${item.product?.quantity || 'N/A'})`)
                  .join(", ") || 'No Products'}`,
                start: dateEntry.date, // Use order delivery date
                allDay: true, // Full-day event
                extendedProps: {
                  customer: order.customer?.name || 'Unknown Customer',
                  products: order.productItems?.map((item) => ({
                    category: item.product?.category || 'Unknown',
                    quantity: item.product?.quantity || 'N/A',
                  })) || [],
                  status: dateEntry.status || 'Unknown',
                },
              }));
          })
          .filter(event => event); // Remove any undefined events

        setEvents(orderEvents);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleEventClick = (info) => {
    try {
      const { customer, products, status } = info.event.extendedProps;
      const productDetails = products
        .map((product) => `${product.category} (${product.quantity})`)
        .join(", ");
      
      Swal.fire({
        title: "Order Details",
        html: `<strong>Customer:</strong> ${customer}<br>
               <strong>Products:</strong> ${productDetails}<br>
               <strong>Status:</strong> ${status}`,
        icon: "info",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error showing event details:", error);
      Swal.fire({
        title: "Error",
        text: "Could not load order details",
        icon: "error",
      });
    }
  };

  return (
    <div className="col-xxl-9 col-lg-8">
      <div className="panel">
        <div className="panel-body">
          <div id="calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              events={events}
              eventClick={handleEventClick}
              eventContent={(eventInfo) => {
                // Custom event rendering for additional safety
                return (
                  <div>
                    <b>{eventInfo.event.title}</b>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCalendarComponent;