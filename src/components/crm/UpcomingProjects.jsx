import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllOrders, URL } from "../../Helper/handle-api";

const UpcomingProjects = () => {
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
          <h5>Today Activities</h5>
          <div className="btn-box">
            <Link to="/calendar" className="btn btn-sm btn-primary">
              View All
            </Link>
          </div>
        </div>
        <div className="panel-body">
          <div className="table-responsive">
            <table className="table table-hover table-activity">
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <tr key={index}>
                      <td>
                        <div className="activity-box">
                          <div className="date-box">
                            <span>{new Date().getDate()}</span>
                            <span>
                              {new Date().toLocaleString("default", {
                                month: "short",
                              })}
                            </span>
                          </div>

                          <div className="part-txt">
                            <span>
                              {order.customer?.name} - {order.customer?.routeno}
                            </span>
                            <span>
                              {order.productItems?.map((item) => (
                                <div key={item._id}>
                                  {item.product?.category} ({item.quantity})
                                  <br />
                                </div>
                              ))}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="avatar-box justify-content-end">
                          {order.productItems?.map((item) => (
                            <div key={item._id} className="avatar">
                              <img
                                src={`${URL}/images/${item.product?.coverimage}`}
                                alt={item.product?.category}
                              />
                            </div>
                          ))}

                          <div className="avatar bg-primary rounded-circle d-flex justify-content-center align-items-center text-white">
                            {order.productItems.length}
                          </div>
                        </div>
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
    </div>
  );
};

export default UpcomingProjects;
