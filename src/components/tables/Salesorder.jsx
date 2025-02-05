import React, { useEffect, useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { FetchCustomer, URL } from "../../Helper/handle-api";
import { getDetailsByRouteName } from "../../Helper/handle-api"; // Import API function

const Salesorders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allCustomer, setAllCustomer] = useState([]);
  const [dataPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    FetchCustomer().then((res) => {
      setAllCustomer(res);
    });
  }, []);

  // Handle Select Product button click
  const handleSelectProduct = async (routeName) => {
    try {
      const route = await getDetailsByRouteName(routeName); // Fetch full route data
      if (route && route.products.length > 0) {
        setSelectedProducts(route.products); // Set only the products array
      } else {
        setSelectedProducts([]); // No products available
      }
      setShowModal(true); // Show modal
    } catch (error) {
      console.error("Error fetching products:", error);
      setSelectedProducts([]);
      setShowModal(true);
    }
  };
  

  return (
    <>
      <OverlayScrollbarsComponent>
        <Table className="table table-dashed table-hover">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Route Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allCustomer.map((data) => (
              <tr key={data.customerId}>
                <td style={{ textAlign: "center" }}>{data.customerId}</td>
                <td>{data.name}</td>
                <td>{data.routeno}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSelectProduct(data.routeno)}
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

      {/* Product Modal */}
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
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

    </>
  );
};

export default Salesorders;
