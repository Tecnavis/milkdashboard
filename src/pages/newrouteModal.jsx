import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { URL } from "../Helper/handle-api";
import Swal from "sweetalert2";

const AddRouteModal = ({ show, handleClose }) => {
  const [routeName, setRouteName] = useState("");

  const handleSave = async () => {
    if (!routeName.trim()) return alert("Route name is required");

    try {
      await axios.post(`${URL}/route`, { name: routeName, products: [] });
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Route created successfully!",
    })
      handleClose();
    } catch (error) {
      console.error("Error creating route:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to create route. Please try again.",
    })
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Route</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Route Name</Form.Label>
            <Form.Control
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Route
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRouteModal;
