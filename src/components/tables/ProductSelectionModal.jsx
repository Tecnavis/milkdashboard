import React, { useState } from "react";
import axios from "axios";
import "./styles.scss";
import { URL } from "../../Helper/handle-api";
import Swal from "sweetalert2";

const ProductSelectionModal = ({ isOpen, onClose, route, allProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectProduct = (productId, price) => {
    setSelectedProducts((prev) => {
      const existingProduct = prev.find(p => p.productId === productId);
      if (existingProduct) {
        return prev.map(p => p.productId === productId ? { ...p, price } : p);
      } else if (price > 0) {
        return [...prev, { productId, price }];
      }
      return prev;
    });
  };
  

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please select at least one product.',
      });
      return;
    }
  
    try {
      const response = await axios.post(`${URL}/route`, {
        name: route.name,
        products: selectedProducts,
      });
  
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Products saved successfully!',
      });
      onClose(); // Close modal after saving
    } catch (error) {
      console.error("Error saving products:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save products.',
      });
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modal-overlays">
      <div className="modal-contents">
        <h4>Select Products for {route.name}</h4>
        <table className="table">
          <thead>
            <tr>
              <th>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="markAllProduct" />
                </div>
              </th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={product._id}
                      onChange={(e) =>
                        handleSelectProduct(product._id, e.target.checked ? product.price || 0 : 0)
                      }
                    />
                  </div>
                </td>
                <td>{product.productId}</td>
                <td>{product.category}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Enter price"
                    onChange={(e) =>
                      handleSelectProduct(product._id, Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-success" onClick={handleSubmit}>
          Save
        </button>
        <button className="btn btn-danger" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
