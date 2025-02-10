import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./bannerstyle.css";
import { Button } from "react-bootstrap";
import BannerTable from "./bannertable";
import { createBanner } from "../../Helper/handle-api"; // Ensure `URL` is removed from import
import Swal from "sweetalert2";

const Banner = () => {
  const [files, setFiles] = useState([]); // State for multiple files
  const [previewUrls, setPreviewUrls] = useState([]); // State for preview images

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles); // Store all selected files

    // Generate preview URLs for each file
    const newPreviewUrls = acceptedFiles.map(file => window.URL.createObjectURL(file));
    setPreviewUrls(newPreviewUrls);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple file selection
  });

  const handleUpload = async () => {
    if (files.length === 0) {
    Swal.fire({
      icon: "warning",
      title: "Missing fields",
      text: "Please select at least one file before uploading.",
    })
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("images", file)); // Append multiple images

    try {
      await createBanner(formData);
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Upload successful!",
    })
      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Upload failed:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Upload failed.",
    })
    }
  };

  return (
    <div className="col-lg-12 col-md-6">
      <div className="card">
        <div className="card-header">File Upload</div>
        <div className={`card-body ${isDragActive ? "dropzone-active" : ""}`} {...getRootProps()}>
          <input {...getInputProps()} />
          <form className="dropzone dz-component" id="file-manager-upload">
          <div className="dz-default dz-message">
            <button className="dz-button" type="button">
              <i className="fa-light fa-cloud-arrow-up"></i>
              <span>Drop files here or click to upload</span>
            </button>
          </div>
          </form>
          {/* Display image previews */}
          <div className="preview-container">
            {previewUrls.map((url, index) => (
              <img key={index} src={url} alt={`Preview ${index}`} className="preview-image" />
            ))}
          </div>
        </div>
        <div className="form-group">
          <Button variant="primary" style={{ width: "100%" }} onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
      <br />
      <BannerTable />
      <br />
    </div>
  );
};

export default Banner;
