import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { FetchCustomer, URL } from "../../Helper/handle-api";
import { getDetailsByRouteName, getPlansByCustomerId } from "../../Helper/handle-api"; 

const Salesorders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allCustomer, setAllCustomer] = useState([]);
  const [dataPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [plans, setPlans] = useState([]); // Store fetched plans
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    FetchCustomer().then((res) => {
      setAllCustomer(res);
    });
  }, []);

  // Handle Select Product button click
 // Modify handleSelectProduct to reset plans when a new customer is selected
const handleSelectProduct = async (customer) => {
    try {
      const route = await getDetailsByRouteName(customer.routeno);
      setCustomerId(customer._id); // Store selected customer's ID
      setSelectedProducts(route?.products || []);
      setPlans([]); // Clear previous plans
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      setSelectedProducts([]);
      setShowModal(true);
    }
  };
  
  // Fetch plans when "Continue" button is clicked
  const handleFetchPlans = async () => {
    if (!customerId) {
      console.error("No customer selected");
      return;
    }
    try {
      const response = await getPlansByCustomerId(customerId);
      if (response.length === 0) {
        console.warn("No plans found for this customer.");
      }
      setPlans(response); // Store fetched plans
    } catch (error) {
      console.error("Error fetching plans:", error);
      setPlans([]); // Reset plans on error
    }
  };
  

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover">
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Customer ID</th>
              <th>Name</th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allCustomer.map((customer) => (
              <tr key={customer._id}>
                <td style={{ textAlign: "center" }}>{customer.customerId}</td>
                <td>{customer.name}</td>
                <td>{customer.routeno}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectProduct(customer)}
                  >
                    Select Product
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>

      <PaginationSection
        currentPage={currentPage}
        totalPages={Math.ceil(allCustomer.length / dataPerPage)}
        paginate={setCurrentPage}
        pageNumbers={Array.from({ length: Math.ceil(allCustomer.length / dataPerPage) }, (_, i) => i + 1)}
      />

      {/* Product & Plans Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProducts.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Route Price</th>
                  <th style={{ textAlign: "center" }}>Image</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.productId.productId}</td>
                    <td>{item.productId.title}</td>
                    <td>{item.productId.category}</td>
                    <td>₹ {item.routePrice}</td>
                    <td style={{ textAlign: "center" }}>
                      <img
                        src={`${URL}/images/${item.productId.coverimage}`}
                        alt={item.productId.title}
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No products available for this route.</p>
          )}

          {/* Plans Table */}
          {plans.length > 0 && (
            <>
              <h5 className="mt-4">Plans</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer Id</th>
                    <th>Plan Type</th>
                    <th>Leaves</th>
                    <th>Active</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, index) => (
                    <tr key={plan._id}>
                      <td>{index + 1}</td>
                      <td>{plan.customerId}</td>
                      <td>{plan.planType}</td>
                      <td>{plan.leaves.length > 0 ? plan.leaves.join(", ") : "None"}</td>
                      <td>{plan.isActive ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleFetchPlans}>
            Continue
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Salesorders;
