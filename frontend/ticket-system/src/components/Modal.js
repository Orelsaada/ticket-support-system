import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const CloseModal = (props) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    if (props.open == true) handleShow();
  });

  return (
    <>
      <Modal show={props.open} onHide={props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Closing Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to close this incident?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.closeModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={props.acceptModal}>
            Close Incident
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CloseModal;
