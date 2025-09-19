

import React, { useEffect, useState } from "react";
import { Table, Form, Row, Col, Button } from "react-bootstrap";
import { FetchCustomer } from "../../Helper/handle-api";

const Collection = () => {
  const [groupedCustomers, setGroupedCustomers] = useState({});
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [showAllData, setShowAllData] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await FetchCustomer();

      // group by route
      const grouped = response.reduce((acc, c) => {
        const routeKey = c.routeno || "No Route";
        acc[routeKey] = acc[routeKey] || [];
        acc[routeKey].push(c);
        return acc;
      }, {});
      setGroupedCustomers(grouped);
    };
    fetchCustomers();
  }, []);

  // Filter customers based on date only when not showing all data
  const filteredGroups = {};
  
  Object.entries(groupedCustomers).forEach(([routeNo, list]) => {
    let filtered = list;
    
    if (!showAllData) {
      filtered = list.filter((c) => {
        // Date filtering for paid amounts
        if (c.paidAmounts && c.paidAmounts.length > 0) {
          // Check if any payment matches the selected month/year
          const hasMatchingPayment = c.paidAmounts.some(payment => {
            if (!payment.date) return false;
            
            const paymentDate = new Date(payment.date);
            const paymentYear = paymentDate.getFullYear();
            const paymentMonth = paymentDate.getMonth() + 1;
            
            return paymentYear === filterYear && paymentMonth === filterMonth;
          });
          
          return hasMatchingPayment;
        }
        
        return false;
      });
    }
    
    if (filtered.length) filteredGroups[routeNo] = filtered;
  });

  // Build one summary row per route
  const rows = Object.entries(filteredGroups).map(([routeNo, customers]) => {
    let totalAmount = 0;
    let totalPaid = 0;

    if (showAllData) {
      // Calculate totals for all data
      totalAmount = customers.reduce((sum, c) => {
        return sum + (c.paidAmounts?.reduce((s, p) => s + p.amount, 0) || 0);
      }, 0);

      totalPaid = customers.reduce((sum, c) => {
        const paidPayments = c.paidAmounts?.filter(p => p.isGet) || [];
        return sum + paidPayments.reduce((s, p) => s + p.amount, 0);
      }, 0);
    } else {
      // Calculate totals filtered by date
      totalAmount = customers.reduce((sum, c) => {
        const customerPayments = c.paidAmounts?.filter(payment => {
          if (!payment?.date) return false;
          
          const paymentDate = new Date(payment.date);
          const paymentYear = paymentDate.getFullYear();
          const paymentMonth = paymentDate.getMonth() + 1;
          
          return paymentYear === filterYear && paymentMonth === filterMonth;
        }) || [];
        
        return sum + customerPayments.reduce((s, p) => s + p.amount, 0);
      }, 0);

      totalPaid = customers.reduce((sum, c) => {
        const customerPayments = c.paidAmounts?.filter(payment => {
          if (!payment?.date) return false;
          
          const paymentDate = new Date(payment.date);
          const paymentYear = paymentDate.getFullYear();
          const paymentMonth = paymentDate.getMonth() + 1;
          
          return paymentYear === filterYear && paymentMonth === filterMonth && payment.isGet;
        }) || [];
        
        return sum + customerPayments.reduce((s, p) => s + p.amount, 0);
      }, 0);
    }

    const totalUnPaid = totalAmount - totalPaid;

    return { routeNo, totalPaid, totalUnPaid, totalAmount };
  });

  // Generate year options (last 5 years and next 1 year)
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    yearOptions.push(i);
  }

  // Month options
  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const handleShowAll = () => {
    setShowAllData(true);
  };

  const handleFilter = () => {
    setShowAllData(false);
  };

  return (
    <div>
      {/* Filter Controls - Only Year and Month */}
      <Row className="m-1 bg-white pb-2">
        <b>Collection</b>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Year</Form.Label>
            <Form.Select
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
              disabled={showAllData}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Month</Form.Label>
            <Form.Select
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
              disabled={showAllData}
            >
              {monthOptions.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button 
            variant={showAllData ? "primary" : "outline-primary"} 
            onClick={handleShowAll}
            className="w-100"
          >
            Show All
          </Button>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button 
            variant={!showAllData ? "primary" : "outline-primary"} 
            onClick={handleFilter}
            className="w-100"
          >
            Filter by Date
          </Button>
        </Col>
      </Row>

      {/* Results */}
      <div style={{ overflowX: "auto" }}>
        {rows.length > 0 ? (
          <Table className="table table-dashed table-hover table-striped">
            <thead className="bg-white">
              <tr>
                <th>Route No</th>
                <th>Paid Amount</th>
                <th>Unpaid Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map(({ routeNo, totalPaid, totalUnPaid, totalAmount }) => (
                <tr key={routeNo}>
                  <td>{routeNo}</td>
                  <td>{totalPaid.toFixed(2)}</td>
                  <td>{totalUnPaid.toFixed(2)}</td>
                  <td>{totalAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No data available for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Collection;