import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import { URL } from "../Helper/handle-api";
import { useParams } from "react-router-dom";


export default function CustomerCalendar() {
  const [payments, setPayments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { id } = useParams();
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const historyResponse = await axios.get(
          `${URL}/customer/paid-amounts/${id}`
        );        
        // Transform backend data to match calendar needs
        const transformed = historyResponse?.data?.paidAmounts?.map(p => ({
          date: p.date,
          amount: p.amount,
          status: p.isGet ? "paid" : "unpaid"
        }));

        setPayments(transformed);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getPaymentsForDate = (year, month, day) =>
    payments.filter(p => {
      const d = new Date(p.date);
      return (
        d.getFullYear() === year &&
        d.getMonth() === month &&
        d.getDate() === day
      );
    });

  return (
    <div style={{ padding: "30px" }}>
      <style>{`
        .calendar-container { display: flex; flex-direction: column; gap: 40px; }
        .month-section { border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
        .month-title { margin-bottom: 15px; }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border: 1px solid #ccc;
        }
        .calendar-day {
          border: 1px solid #eee;
          height: 100px;
          padding: 5px;
          font-size: 12px;
        }
        .payment-tag { display: block; font-size: 11px; }
        .payment-tag.paid { color: green; }
        .payment-tag.unpaid { color: red; }
        .summary {
          margin-top: 10px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
      `}</style>

      <h3>Customer Calendar View</h3>

      <DropdownButton
        title={`Year: ${selectedYear}`}
        onSelect={year => setSelectedYear(Number(year))}
      >
        {[2023, 2024, 2025, 2026].map(y => (
          <Dropdown.Item key={y} eventKey={y}>{y}</Dropdown.Item>
        ))}
      </DropdownButton>

      <div className="calendar-container">
        {months.map((monthName, monthIndex) => {
          const daysInMonth = getDaysInMonth(monthIndex, selectedYear);
          let totalPaid = 0, totalUnpaid = 0;

          const days = [];
          for (let day = 1; day <= daysInMonth; day++) {
            const dayPayments = getPaymentsForDate(selectedYear, monthIndex, day);
            dayPayments.forEach(p => {
              p.status === "paid"
                ? totalPaid += p.amount
                : totalUnpaid += p.amount;
            });

            days.push(
              <div key={day} className="calendar-day">
                <strong>{day}</strong>
                {dayPayments.map((p, idx) => (
                  <span
                    key={idx}
                    className={`payment-tag ${p.status}`}
                  >
                    ₹{p.amount} ({p.status})
                  </span>
                ))}
              </div>
            );
          }

          return (
            <div key={monthName} className="month-section">
              <h5 className="month-title">{monthName}</h5>
              <div className="calendar-grid">{days}</div>
              <div className="summary">
                <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
                <p><strong>Total Unpaid:</strong> ₹{totalUnpaid}</p>
                {/* {totalUnpaid > 0 && (
                  <Button size="sm" variant="danger">Do Payment</Button>
                )} */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
