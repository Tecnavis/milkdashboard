import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./bannerstyle.scss";
import { Button } from "react-bootstrap";
import BannerTable from "./bannertable";
import { createBanner } from "../../Helper/handle-api";
import Swal from "sweetalert2";

const Banner = () => {
  const [files, setFiles] = useState([]); // Multiple files
  const [previewUrls, setPreviewUrls] = useState([]); // Image previews

  // Handle dropped or selected files
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]); // Append new files
    const newPreviewUrls = acceptedFiles.map((file) =>
      window.URL.createObjectURL(file)
    );
    setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]); // Append previews
  }, []);

  // Revoke object URLs to free memory when unmounted
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => window.URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // Allow multiple files
  });

  // Upload handler
  const handleUpload = async () => {
    if (files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing fields",
        text: "Please select at least one file before uploading.",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file)); // Append multiple images

    try {
      await createBanner(formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Upload successful!",
      });

      // Reset after upload
      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Upload failed.",
      });
    }
  };

  return (
    <div className="col-lg-12 col-md-6">
      <div className="card">
        <div className="card-header">File Upload</div>

        <div
          className={`card-body ${isDragActive ? "dropzone-active" : ""}`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />

          <form className="dropzone dz-component" id="file-manager-upload">
            <div className="dz-default dz-message">
              <button className="dz-button" type="button">
                <i className="fa-light fa-cloud-arrow-up"></i>
                <span>Drop files here or click to upload</span>
              </button>
            </div>
          </form>

          {/* Preview container */}
          <div className="preview-container d-flex flex-wrap mt-3">
            {previewUrls.map((url, index) => (
              <div key={index} className="m-2">
                <img
                  src={url}
                  alt={`Preview ${index}`}
                  className="preview-image"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-group mt-3">
          <Button
            variant="primary"
            style={{ width: "100%" }}
            onClick={handleUpload}
          >
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
