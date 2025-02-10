import React, { useEffect, useState } from "react";
import { fetchBanner, URL, deleteBanner, updateBanner } from "../../Helper/handle-api";
import "./bannerstyle.css";

const BannerTable = () => {
  const [banners, setBanners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [formData, setFormData] = useState({
    images: [],
  });

  // Fetch banners on load
  useEffect(() => {
    fetchBanner().then((res) => {
      setBanners(res);
    });
  }, []);

  // Open modal for editing
  const handleEditClick = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      images: [],
    });
    setIsModalOpen(true);
  };

  // Handle multiple image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    setFormData({ ...formData, images: files });
  };

  // Handle banner update
  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!selectedBanner) return;

    const updatedData = new FormData();
    formData.images.forEach((file) => updatedData.append("images", file)); // Append multiple images

    try {
      await updateBanner(selectedBanner._id, updatedData);
      const bannersAfterUpdate = await fetchBanner();
      setBanners(bannersAfterUpdate);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to update banner", error);
    }
  };

  return (
    <div className="col-xl-12 col-lg-6 container">
      <div className="panel">
        <div className="panel-header">
          <h5>Banner List</h5>
        </div>
        <div className="panel-body p-0">
          <div className="table-responsive">
            <table className="table deadline-table table-hover">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Images</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner, index) => (
                  <tr key={banner._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="banner-images">
                        {banner.images.map((image, imgIndex) => (
                          <img key={imgIndex} src={`${URL}/images/${image}`} alt="" className="banner-img" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div>
                        <button className="btn btn-sm btn-primary" style={{ marginRight: "5px" }} onClick={() => handleEditClick(banner)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteBanner(banner._id)}>
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Editing Banner */}
      <div className={`modal fade ${isModalOpen ? "show" : ""}`} style={{ display: isModalOpen ? "block" : "none" }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Banner</h5>
              <button type="button" className="close" onClick={() => setIsModalOpen(false)}>
                <span>&times;</span>
              </button>
            </div>
            <form onSubmit={handleUpdateBanner}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Upload Images:</label>
                  <input type="file" className="form-control" multiple accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Update</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerTable;
