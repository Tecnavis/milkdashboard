// import React, { useEffect, useState } from "react";
// import { fetchBanner,  updateBanner, deleteBannerIndex, deleteBannerAll } from "../../Helper/handle-api";
// import "./bannerstyle.scss";

// const BannerTable = ({loadBanners, banners, setBanners}) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedBannerId, setSelectedBannerId] = useState(null);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(null);
//   const [newImage, setNewImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   useEffect(() => {
//     loadBanners();
//   }, []);



//   const handleEditImage = (bannerId, imageIndex, currentImage) => {
//     setSelectedBannerId(bannerId);
//     setSelectedImageIndex(imageIndex);
//     setPreviewImage(currentImage);
//     setIsModalOpen(true);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setNewImage(file);
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const handleUpdateBanner = async (e) => {
//     e.preventDefault();
//     if (!selectedBannerId || selectedImageIndex === null || !newImage) return;

//     const formData = new FormData();
//     formData.append("image", newImage);
//     formData.append("index", selectedImageIndex);

//     try {
//       await updateBanner(selectedBannerId, formData);
//       await loadBanners();
//       setIsModalOpen(false);
//       setNewImage(null);
//       setSelectedImageIndex(null);
//     } catch (error) {
//       console.error("Failed to update banner image", error);
//     }
//   };

//   return (
//     <div className="banner-container">
//       <h4 className="mb-4 font-semibold text-lg text-center">All Banner Images</h4>
// {
//   !banners.length == 0  &&
//       // <button style={{backgroundColor: "red", border: "none", color: "white", padding: 6, borderRadius: 3, marginBottom: 10}} onClick={deleteBannerAll()}>Delete All</button>
//       <button
//   style={{
//     backgroundColor: "red",
//     border: "none",
//     color: "white",
//     padding: 6,
//     borderRadius: 3,
//     marginBottom: 10
//   }}
//   onClick={deleteBannerAll()}
// >
//   Delete All
// </button>

// }

//       {/* ✅ Card Grid Layout */}
//       <div className="banner-grid">
//         {banners.length > 0 && banners[0].images ? (
//           banners[0].images.map((image, index) => (
//             <div className="banner-card" key={index}>
//               <img src={image} alt={`Banner ${index}`} className="banner-card-img" />
//               <div className="banner-card-footer">
//                 {/* <span className="text-sm text-gray-700 font-medium">Banner #{index + 1}</span> */}
//                 <div className="banner-btns">
//                   <button
//                     className="btn btn-sm btn-outline-primary"
//                     onClick={() => handleEditImage(banners[0]._id, index, image)}
//                   >
//                     <i className="fa-regular fa-pen-to-square"></i> Edit
//                   </button>
//                   <button
//                     className="btn btn-sm btn-outline-danger"
//                     onClick={() => deleteBannerIndex(banners[0]._id, index)}
//                   >
//                     <i className="fa-regular fa-trash-can"></i> Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center w-full mt-4 text-muted">No banner images found.</p>
//         )}
//       </div>

//       {/* ✅ Edit Modal */}
//       {isModalOpen && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <div className="modal-header">
//               <h5>Edit Banner Image</h5>
//               <button className="close-btn" onClick={() => setIsModalOpen(false)}>
//                 &times;
//               </button>
//             </div>
//             <form onSubmit={handleUpdateBanner}>
//               <div className="modal-body">
//                 <div className="preview-section">
//                   {previewImage && (
//                     <img src={previewImage} alt="Preview" className="preview-img" />
//                   )}
//                 </div>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="form-control mt-2"
//                   onChange={handleImageChange}
//                 />
//               </div>
//               <div className="modal-footer">
//                 <button type="submit" className="btn btn-primary w-100">Update</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BannerTable;


import React, { useEffect, useState } from "react";
import {
  fetchBanner,
  updateBanner,
  deleteBannerIndex,
  deleteBannerAll,
} from "../../Helper/handle-api";

import "./bannerstyle.scss";

const BannerTable = ({ loadBanners, banners, setBanners }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Load banners only ONCE
  useEffect(() => {
    loadBanners();
    // eslint-disable-next-line
  }, []);

  const handleEditImage = (bannerId, index, currentImage) => {
    setSelectedBannerId(bannerId);
    setSelectedImageIndex(index);
    setPreviewImage(currentImage);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();
    if (!newImage) return;

    const formData = new FormData();
    formData.append("image", newImage);
    formData.append("index", selectedImageIndex);

    await updateBanner(selectedBannerId, formData);
    setIsModalOpen(false);
    setNewImage(null);
    setSelectedImageIndex(null);
    loadBanners();
  };

  return (
    <div className="banner-container">
      <h4 className="mb-4 text-center">All Banner Images</h4>

      {banners.length > 0 && banners[0].images?.length > 0 && (
        <button
          style={{
            backgroundColor: "red",
            border: "none",
            color: "white",
            padding: 6,
            borderRadius: 3,
            marginBottom: 10,
          }}
          onClick={() => deleteBannerAll().then(loadBanners)}
        >
          Delete All
        </button>
      )}

      <div className="banner-grid">
        {banners.length > 0 && banners[0].images ? (
          banners[0].images.map((image, index) => (
            <div className="banner-card" key={index}>
              <img src={image} alt="" className="banner-card-img" />

              <div className="banner-card-footer">
                <div className="banner-btns">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditImage(banners[0]._id, index, image)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      deleteBannerIndex(banners[0]._id, index).then(loadBanners)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center w-full mt-4">No banner images found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h5>Edit Banner Image</h5>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateBanner}>
              <div className="modal-body">
                {previewImage && (
                  <img src={previewImage} alt="Preview" className="preview-img" />
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="form-control mt-2"
                  onChange={handleImageChange}
                />
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary w-100">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerTable;
