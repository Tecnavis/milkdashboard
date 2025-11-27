// import React, { useEffect, useState } from "react";
// import { Modal, Button } from "react-bootstrap";
// import {
//   fetchMainCategory,
//   fetchProductById,
//   URL,
// } from "../../Helper/handle-api";
// import Swal from "sweetalert2";
// import axios from "axios";

// const  EditProductModal = ({ productId, show, onClose, onSave }) => {
//   const [mainCategories, setMainCategories] = useState([]);
//   const [formValues, setFormValues] = useState({});
//   const [images, setImages] = useState([]);
//   const [coverImage, setCoverImage] = useState(null);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [coverImagePreview, setCoverImagePreview] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const categories = await fetchMainCategory();
//         setMainCategories(categories);

       
//         if (productId) {
//           const productData = await fetchProductById(productId);
//           setFormValues(productData);

//           if (productData.images && productData.images.length > 0) {
//             const previews = productData.images.map((img) => {
//               const imageUrl = `${URL}/images/${img}`;
//               return imageUrl.replace(/[[\]]/g, "");
//             });
//             setImagePreviews(previews);
//           }

//           if (productData.coverimage) {
//             setCoverImagePreview(productData.coverimage);
//           }


//         }
//       } catch (error) {
//         console.error("Error fetching initial data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: "Failed to load product data. Please try again.",
//         });
//       }
//     };

//     fetchData();
//   }, [productId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prevValues) => ({
//       ...prevValues,
//       [name]: value,
//     }));

//     if (name === "mainCategory") {
//       handleMainCategoryChange(value);
//     }
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     const previews = files.map((file) => URL.createObjectURL(file));
//     setImagePreviews(previews);
//   };

//   const handleCoverImageChange = (e) => {
//     const file = e.target.files[0];
//     setCoverImage(file);
//     if (file) {
//       setCoverImagePreview(URL.createObjectURL(file));
//     }
//   };

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     if (!formValues.title || !formValues.description || !formValues.price) {
//       Swal.fire({
//         icon: "warning",
//         title: "Missing fields",
//         text: "Please fill out all the required fields.",
//       });
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("title", formValues.title);
//     formData.append("description", formValues.description);
//     formData.append("category", formValues.mainCategory);
//     formData.append("price", formValues.price);
//     formData.append("quantity", formValues.quantity);
//     formData.append("discount", formValues.discount || ""); // Optional field
  
//     if (coverImage) {
//           formData.append('image', coverImage);
//     }
  
//     // Log the formData to ensure all fields are being appended
//     for (const pair of formData.entries()) {
//       console.error(`${pair[0]}: ${pair[1]}`);
//     }
  
//     try {
//       const response = await axios.put(
//         `${URL}/product/${productId}`,
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );
  
//       if (response.status === 200) {
//         Swal.fire({
//           icon: "success",
//           title: "Success",
//           text: "Product updated successfully!",
//         });
//         onSave();
//         onClose();
//       } else {
//         throw new Error("Failed to update product");
//       }
//     } catch (error) {
//       console.error("Error updating product:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text: "Failed to update the product. Please try again.",
//       });
//     }
//   };
  
//   return (
//     <Modal show={show} onHide={onClose} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Product</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label>Category</label>
//             <select
//               value={formValues.mainCategory}
//               onChange={handleInputChange}
//               name="mainCategory"
//               className="form-control"
//             >
//               <option value="">Select main category</option>
//               {mainCategories.map((category) => (
//                 <option key={category._id} value={category.name}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>


//           <div className="mb-3">
//             <label>Price</label>
//             <input
//               type="number"
//               value={formValues.price}
//               onChange={handleInputChange}
//               name="price"
//               className="form-control"
//             />
//           </div>
          
//           <div className="mb-3">
//             <label>Title</label>
//             <input
//               type="text"
//               value={formValues.title}
//               onChange={handleInputChange}
//               name="title"
//               className="form-control"
//             />
//           </div>
//           <div className="mb-3">
//             <label>Quantity</label>
//             <input
//               type="text"
//               value={formValues.quantity}
//               onChange={handleInputChange}
//               name="quantity"
//               className="form-control"
//             />
//           </div>
//           <div className="mb-3">
//             <label>Discount</label>
//             <input
//               type="text"
//               value={formValues.discount}
//               onChange={handleInputChange}
//               name="discount"
//               className="form-control"
//             />
//           </div>
//           <div className="mb-3">
//             <label>Description</label>
//             <textarea
//               value={formValues.description}
//               onChange={handleInputChange}
//               name="description"
//               className="form-control"
//             />
//           </div>

//           {/* <div className="mb-3">
//             <label>Images</label>
//             <input
//               type="file"
//               multiple
//               onChange={handleImageChange}
//               className="form-control"
//             />
//           </div> */}
//           <div className="mb-3">
//             <label>Image</label>
//             <input
//               type="file"
//               onChange={handleCoverImageChange}
//               className="form-control"
//             />
//           </div>

//           {/* Preview Cover Image */}
//           {coverImagePreview && (
//             <div className="mb-3">
//               <label> Image Preview</label>
//               <img
//                 src={coverImagePreview}
//                 alt="Cover Preview"
//                 // style={{ width: "100%", height: "10%" }}
//                    style={{
//           width: "150px",
//           height: "150px",
//           borderRadius: "10px",
//           objectFit: "cover",
//           border: "1px solid #ddd",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//         }}
//               />
//             </div>
//           )}

//           {/* Preview Images */}
//           {/* {imagePreviews.length > 0 && (
//             <div className="mb-3">
//               <label>Images Preview</label>
//               <div className="d-flex flex-wrap">
//                 {imagePreviews.map((img, index) => (
//                   <img
//                     key={index}
//                     src={img}
//                     alt={`Preview ${index}`}
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       marginRight: "5px",
//                       marginBottom: "5px",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>
//           )} */}

//           <Button style={{margin: 5}} variant="primary" type="submit">
//             Save Changes
//           </Button>
//           <Button variant="secondary" onClick={onClose}>
//             Close
//           </Button>
//         </form>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default EditProductModal;


import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Card } from "react-bootstrap";
import {
  fetchMainCategory,
  fetchProductById,
  URL,
} from "../../Helper/handle-api";
import Swal from "sweetalert2";
import axios from "axios";

const EditProductModal = ({ productId, show, onClose, onSave }) => {
  const [mainCategories, setMainCategories] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categories = await fetchMainCategory();
        setMainCategories(categories);

        if (productId) {
          const productData = await fetchProductById(productId);
          setFormValues(productData);
          
          // Set current category for display and form
          if (productData.mainCategory) {
            setCurrentCategory(productData.mainCategory);
            // Pre-populate the select with current category
            setFormValues(prev => ({
              ...prev,
              mainCategory: productData.mainCategory
            }));
          }

          if (productData.images && productData.images.length > 0) {
            const previews = productData.images.map((img) => {
              const imageUrl = `${URL}/images/${img}`;
              return imageUrl.replace(/[[\]]/g, "");
            });
            setImagePreviews(previews);
          }

          if (productData.coverimage) {
            setCoverImagePreview(productData.coverimage);
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load product data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchData();
    }
  }, [productId, show]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.title || !formValues.description || !formValues.price) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please fill out all the required fields.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", formValues.title);
    formData.append("description", formValues.description);
    
    // Always send the current category value from the form
    // This ensures we don't send undefined
    formData.append("category", formValues.mainCategory);
    
    formData.append("price", formValues.price);
    formData.append("quantity", formValues.quantity);
    formData.append("discount", formValues.discount || "");

    if (coverImage) {
      formData.append('image', coverImage);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${URL}/product/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product updated successfully!",
        });
        onSave();
        onClose();
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered className="edit-product-modal">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="w-100 text-center fw-bold text-primary">
          Edit Product
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading product data...</p>
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        value={formValues.mainCategory || ""}
                        onChange={handleInputChange}
                        name="mainCategory"
                        className="form-control form-control-lg"
                        required
                      >
                        <option value="">Select category</option>
                        {mainCategories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {currentCategory && (
                        <div className="form-text text-success">
                          <i className="bi bi-info-circle me-1"></i>
                          Current category: <strong>{currentCategory}</strong>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Price <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">₹</span>
                        <input
                          type="number"
                          value={formValues.price || ""}
                          onChange={handleInputChange}
                          name="price"
                          className="form-control form-control-lg"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        value={formValues.quantity || ""}
                        onChange={handleInputChange}
                        name="quantity"
                        className="form-control form-control-lg"
                        placeholder="Enter quantity"
                        min="0"
                        required
                      />
                    </div>
                  </Col>

                  <Col md={6}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Product Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={formValues.title || ""}
                        onChange={handleInputChange}
                        name="title"
                        className="form-control form-control-lg"
                        placeholder="Enter product title"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Discount
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          value={formValues.discount || ""}
                          onChange={handleInputChange}
                          name="discount"
                          className="form-control form-control-lg"
                          placeholder="0"
                          min="0"
                          max="100"
                        />
                        <span className="input-group-text bg-light">%</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-dark">
                        Cover Image
                      </label>
                      <input
                        type="file"
                        onChange={handleCoverImageChange}
                        className="form-control form-control-lg"
                        accept="image/*"
                      />
                      <div className="form-text">
                        Upload a new cover image (optional)
                      </div>
                    </div>

                    {coverImagePreview && (
                      <div className="mb-3 text-center">
                        <label className="form-label fw-semibold text-dark d-block">
                          Current Cover Image
                        </label>
                        <div className="d-flex justify-content-center">
                          <img
                            src={coverImagePreview}
                            alt="Cover Preview"
                            className="img-thumbnail"
                            style={{
                              width: "150px",
                              height: "150px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              border: "2px solid #dee2e6",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    value={formValues.description || ""}
                    onChange={handleInputChange}
                    name="description"
                    className="form-control form-control-lg"
                    rows="4"
                    placeholder="Enter product description..."
                    style={{ resize: "vertical" }}
                    required
                  />
                </div>

                <div className="d-flex justify-content-center gap-3 pt-3 border-top">
                  <Button
                    variant="outline-secondary"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 fw-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 fw-semibold"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;