import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import { fetchProducts, URL } from "../../Helper/handle-api";
import EditProductModal from "./editproductmodal";
import axios from "axios";
import Swal from "sweetalert2";
const AllProductTable = () => {
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = products.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(products.length / dataPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // All product list

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetchProducts();
      setProducts(response);
    };
    fetchProduct();
  }, []);

  // Handle size selection and set stock count for each size
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

 


  // Handle product edit icon click
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${URL}/product/${productId}`);
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product._id !== productId)
          );
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error.response?.data || error.message);
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Failed to delete product.",
            "error"
          );
        }
      }
    });
  };
  
  return (
    <>
      <OverlayScrollbarsComponent>
        <Table
          className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
          id="allProductTable"
        >
          <thead>
            <tr>
              <th className="no-sort">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="markAllProduct"
                  />
                </div>
              </th>
              <th>Product</th>
              <th>ID</th>
              <th>Description</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((product) => {

              return (
                <tr key={product._id}>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="table-product-card">
                      <div className="part-img">
                        <img
                          src={`${URL}/images/${product.coverimage}`}
                          alt="Product"
                        />
                      </div>
                      <div className="part-txt">
                        <span className="product-category">
                          Category: {product.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>{product.productId}</td>
                  <td
                    style={{
                      maxWidth: "300px",
                      wordWrap: "break-word",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {product.description}
                  </td>

                  <td>${product.price}</td>
                  <td>{product.discount}</td>
                  <td>
                    <div className="btn-box">
                      <button onClick={() => handleEditProduct(product)}>
                        <i className="fa-light fa-pen"></i>
                      </button>

                      <button onClick={() => handleDeleteProduct(product._id)}>
                        <i className="fa-light fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </OverlayScrollbarsComponent>
      <PaginationSection
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        pageNumbers={pageNumbers}
      />
      <EditProductModal
        productId={selectedProduct?._id}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </>
  );
};

export default AllProductTable;
