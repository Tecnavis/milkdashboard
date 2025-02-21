import React, { useEffect, useState } from "react";
import { fetchAllOrders } from "../../Helper/handle-api";

const PendingWork = () => {
  const [orders, setOrders] = useState([]);

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
  const today = new Date().toISOString().split("T")[0];

  // Filter orders for today's date based on plan type
  const filteredOrders = orders
    .map((order) => {
      if (order.selectedPlanDetails?.dates) {
        const todayPlan = order.selectedPlanDetails.dates.find(
          (d) => d.date.split("T")[0] === today
        );

        // Check for both "monthly" and "custom" plans
        if (
          (order.plan.planType === "monthly" ||
            order.plan.planType === "custom" ||
            order.plan.planType === "daily" ||
            order.plan.planType === "weekly" ||
            order.plan.planType === "alternative") &&
          todayPlan
        ) {
          return {
            ...order,
            selectedPlanDetails: {
              ...order.selectedPlanDetails,
              dates: [todayPlan],
            },
          };
        }
      }
      return null;
    })
    .filter((order) => order !== null);
  // const currentData = filteredOrders.slice(indexOfFirstData, indexOfLastData);

  return (
    <div className="col-lg-6">
      <div className="panel">
        <div className="panel-header">
          <h5>Pending Works</h5>
        </div>
        <div className="panel-body p-0">
          <table className="table table-hover pending-task-table" tabIndex="1">
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <tr key={index}>
                    <td>
                      <div className="task-box">
                        <span>
                          {order.customer.name}- {order.address?.postcode} -{" "}
                          {order.address?.streetAddress},
                          {order.address?.apartment}
                          <br />
                        </span>
                        <span>{order.customer.routeno}</span>
                      </div>
                    </td>
                    <td>
                      <span className="d-block text-end">
                      <span
  className={`badge px-2 ${
    order.selectedPlanDetails.dates[0].status === "pending"
      ? "bg-warning text-dark"
      : "bg-success"
  }`}
>
  {order.selectedPlanDetails.dates[0].status}
</span>

                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingWork;
