import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { FetchCustomer, getDetailsByRouteName, createPlan, createOrder, URL } from "../../Helper/handle-api"; 

const Salesorders = () => {
  const [allCustomer, setAllCustomer] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

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
      const response = await createPlan({
        customerId: selectedCustomer._id,
        planType: selectedPlan,
      });
      if (response.plan) {
        setSelectedPlan(response.plan);
        setShowPlanModal(false);
        setOrderConfirmed(true);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  // Confirm order
  const handleOrder = async () => {
    try {
      const response = await createOrder({
        customerId: selectedCustomer._id,
        productItems: selectedProducts.map((p) => ({ productId: p.productId, quantity: 1 })),
        planId: selectedPlan._id,
        paymentMethod: "Cash",
        routeprice: 10, // Example route price
      });
      if (response.order) {
        alert("Order placed successfully!");
      }
    } catch (error) {
      console.error("Error creating order:", error);
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
            <th>Price ($)</th>
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
              <td>{product.productIds}</td>
              <td>{product.productId.category}</td>
              <td>{product.routePrice}</td>
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
          {plans.map((plan) => (
            <div key={plan}>
              <input
                type="radio"
                name="plan"
                value={plan}
                checked={selectedPlan === plan}
                onChange={() => setSelectedPlan(plan)}
              />
              {plan}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPlanModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreatePlan}>Create Plan</Button>
        </Modal.Footer>
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
