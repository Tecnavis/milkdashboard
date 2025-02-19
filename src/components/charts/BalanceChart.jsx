import React, { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DigiContext } from "../../context/DigiContext";
import { fetchAllOrders } from "../../Helper/handle-api";
import moment from "moment";

const BalanceChart = () => {
  const { isLightTheme, isRechartHeight } = useContext(DigiContext);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    fetchAllOrders().then((data) => {
      setAllOrders(data);
    });
  }, []);

  // Get the current week's start (Sunday) and end (Saturday)
  const startOfWeek = moment().startOf("week");
  const endOfWeek = moment().endOf("week");

  // Initialize order count for each day of the week
  const orderCounts = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  // Filter orders and count per weekday
  allOrders.forEach((order) => {
    order.selectedPlanDetails?.dates?.forEach(({ date }) => {
      const orderDate = moment(date);
      if (orderDate.isBetween(startOfWeek, endOfWeek, "day", "[]")) {
        const dayName = orderDate.format("dddd"); // Get full weekday name
        orderCounts[dayName] += 1;
      }
    });
  });

  // Convert orderCounts into an array for the chart
  const data = Object.keys(orderCounts).map((day) => ({
    name: day,
    order: orderCounts[day],
  }));

  return (
    <ResponsiveContainer width="100%" maxHeight={410} minHeight={isRechartHeight}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3" stroke={`${isLightTheme ? "rgb(0 0 0 / 20%)" : "rgba(255, 255, 255, 0.2)"}`} />
        <XAxis dataKey="name" stroke={`${isLightTheme ? "hsl(0deg 0% 0% / 70%)" : "hsl(0deg 0% 89.41% / 70%)"}`} />
        <YAxis stroke={`${isLightTheme ? "hsl(0deg 0% 0% / 70%)" : "hsl(0deg 0% 89.41% / 70%)"}`} />
        <Tooltip />
        <Legend />
        <Bar dataKey="order" stackId="stack" fill="#0D99FF" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BalanceChart;
