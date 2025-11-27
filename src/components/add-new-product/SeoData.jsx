import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import imageCompression from "browser-image-compression";
import { fetchMainCategory, URL } from '../../Helper/handle-api';
import { useForm } from '../../Helper/useForm';

const SeoData = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [values, handleChange] = useForm({
    title: '',
    description: '',
    category: '',
    price: '',
    discount: '',
    quantity: '',
  });
  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    fetchMainCategory().then((data) => setAllCategory(data));
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedImages = await Promise.all(
      files.map(async (file) => {
        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 800 };
        return await imageCompression(file, options);
      })
    );
    setImages([...images, ...compressedImages]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.category || !values.title || !values.price || !values.quantity || !coverImage ) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing fields',
        text: 'Please fill out all the required fields and upload at least one image.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', coverImage);
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('category', values.category);
    formData.append('price', values.price);
    formData.append('discount', values.discount || '');
    formData.append('quantity', values.quantity);

    try {
      const response = await axios.post(`${URL}/product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product created successfully!',
      });
     window.location.href = "/allProduct";

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error creating product!',
      });
    }
  };

  return (
    <div className="panel">
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Category</label>
          <div className="col-md-10">
            <select
              className="form-control form-control-sm"
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              <option value="">Select main category</option>
              {allCategory.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Title</label>
          <div className="col-md-10">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
            />
          </div>
        </div>
        <br />

        <div className="row g-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Description</label>
          <div className="col-md-10">
            <textarea
              className="form-control form-control-sm"
              placeholder="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
            />
          </div>
        </div>
        <br />

        {/* <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Images</label>
          <div className="col-md-10">
            <input
              type="file"
              className="form-control form-control-sm"
              multiple
              onChange={handleImageChange}
            />
          </div>
        </div> */}

        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Image</label>
          <div className="col-md-10">
            <input
              type="file"
              className="form-control form-control-sm"
              onChange={handleCoverImageChange}
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <label className="col-md-2 col-form-label col-form-label-sm">Price</label>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control form-control-sm"
              placeholder="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Discount"
              name="discount"
              value={values.discount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Quantity"
              name="quantity"
              value={values.quantity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="col-12">
          <button className="btn btn-primary" style={{ width: "100%" }}>
            Save
          </button>
        </div>
        <br />
      </form>
      <br />
    </div>
  );
};

export default SeoData;
