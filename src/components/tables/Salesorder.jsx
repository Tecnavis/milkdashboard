import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FetchCustomer, getDetailsByRouteName, createPlan, createOrder, URL } from "../../Helper/handle-api"; 
import Swal from "sweetalert2";

const Salesorders = () => {
  const [allCustomer, setAllCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [interval, setInterval] = useState(2);
  const [customDates, setCustomDates] = useState([]);
  useEffect(() => {
    FetchCustomer().then((res) => setAllCustomer(res));
  }, []);

  // Fetch products based on customer
  const handleSelectProduct = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const route = await getDetailsByRouteName(customer.routeno);
      if (route && route.products.length > 0) {
        setSelectedProducts(route.products);
      } else {
        setSelectedProducts([]);
      }
      setShowProductModal(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch plans after selecting products
  const handleContinueToPlans = async () => {
    setShowProductModal(false);
    setShowPlanModal(true);
    setPlans(["daily", "custom", "weekly", "alternative", "monthly"]); // Plan types
  };

  // Create plan and proceed to order
  const handleCreatePlan = async () => {
    try {
      let planData = {
        customerId: selectedCustomer._id,
        planType: selectedPlan || "none", // Ensure it is never null
      };
  
      // Add specific data based on plan type
      switch (selectedPlan) {
        case "weekly":
          planData.weeklyDays = selectedDays;
          break;
        case "alternative":
          planData.startDate = startDate;
          planData.interval = interval;
          break;
        case "custom":
          planData.customDates = customDates;
          break;
      }
  
      const response = await createPlan(planData);
      if (response.plan) {
        setSelectedPlan(response.plan);
        setShowPlanModal(false);
        setOrderConfirmed(true);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Plan created successfully!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create plan",
      });
    }
  };
  
  const handleSkipPlan = async () => {
    try {
      const planData = {
        customerId: selectedCustomer._id,
        planType: "none"
      };
    
      // Send request to backend
      const response = await createPlan(planData);
    
      if (response.plan) { // Check for plan in response
        setSelectedPlan(response.plan);
        setShowPlanModal(false);
        setOrderConfirmed(true);
        Swal.fire({
          icon: "success",
          title: "Plan Skipped",
          text: "You can proceed to order products without a plan.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to skip plan",
      });
    }
  };
  
  
  
  const renderPlanOptions = () => {
    switch (selectedPlan) {
      case 'weekly':
        return (
          <div className="mt-3">
            <h6>Select Days</h6>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <Form.Check
                key={day}
                type="checkbox"
                label={day}
                checked={selectedDays.includes(index)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDays([...selectedDays, index]);
                  } else {
                    setSelectedDays(selectedDays.filter(d => d !== index));
                  }
                }}
              />
            ))}
          </div>
        );

      case 'alternative':
        return (
          <div className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interval (days)</Form.Label>
              <Form.Control
                type="number"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                min={1}
              />
            </Form.Group>
          </div>
        );

      case 'custom':
        return (
          <div className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Select Dates</Form.Label>
              <Form.Control
                type="date"
                onChange={(e) => {
                  const newDate = e.target.value;
                  if (!customDates.includes(newDate)) {
                    setCustomDates([...customDates, newDate]);
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <div className="selected-dates">
              {customDates.map((date, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => setCustomDates(customDates.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  

  // Confirm order
  const handleOrder = async () => {
    try {
      const productItemsWithPrices = selectedProducts.map((product) => ({
        productId: product.productId._id,
        quantity: 1,
        routePrice: product.routePrice, // Include the routePrice
      }));
  
      const totalRoutePrice = selectedProducts.reduce(
        (sum, product) => sum + (product.routePrice || 0),
        0
      );
  
      const orderData = {
        customerId: selectedCustomer._id,
        productItems: productItemsWithPrices,
        planId: selectedPlan ? selectedPlan._id : null, // Allow null plan
        paymentMethod: "Cash",
        routeprice: totalRoutePrice,
      };
  
      const response = await createOrder(orderData);
  
      if (response.order) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Order created successfully!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to create order",
      });
    }
  };
  
  

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table className="table table-hover">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allCustomer.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.name}</td>
                <td>{customer.routeno}</td>
                <td>
                  <Button onClick={() => handleSelectProduct(customer)}>Select Products</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>

      {/* Product Selection Modal */}
<Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
  <Modal.Header closeButton>
    <Modal.Title>Select Products</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedProducts.length > 0 ? (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Image</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price </th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product) => (
            <tr key={product._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.some((p) => p._id === product._id)}
                  onChange={(e) =>
                    setSelectedProducts(
                      e.target.checked
                        ? [...selectedProducts, product]
                        : selectedProducts.filter((p) => p._id !== product._id)
                    )
                  }
                />
              </td>
              <td>
                <img src={`${URL}/images/${product.productId.coverimage}`} alt={product.productId.image} style={{ width: "50px", height: "50px" }}/>
              </td>
              <td>{product.productId.productId}</td>
              <td>{product.productId.category}</td>
              <td>{product.productId.quantity}</td>
              <td>₹{product.routePrice}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : (
      <p>No products available</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowProductModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleContinueToPlans}>Continue</Button>
  </Modal.Footer>
</Modal>


      {/* Plan Selection Modal */}
      <Modal show={showPlanModal} onHide={() => setShowPlanModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Select Plan</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="d-flex flex-wrap">
      {plans.map((plan) => (
        <Button
          key={plan}
          variant={selectedPlan === plan ? "primary" : "outline-primary"}
          className="m-2"
          onClick={() => setSelectedPlan(plan)}
        >
          {plan.toUpperCase()}
        </Button>
      ))}
    </div>

    {selectedPlan && renderPlanOptions()}

    <div className="d-flex justify-content-between mt-4">
  <Button variant="danger" onClick={handleSkipPlan}>
    Skip Plan
  </Button>
  {selectedPlan && ( // Only show Continue if a plan is selected
    <Button variant="success" onClick={handleCreatePlan}>
      Continue
    </Button>
  )}
</div>
  </Modal.Body>
</Modal>


      {/* Order Button */}
      {orderConfirmed && (
        <Button variant="success" onClick={handleOrder}>
          Order Now
        </Button>
      )}
    </>
  );
};

export default Salesorders;
