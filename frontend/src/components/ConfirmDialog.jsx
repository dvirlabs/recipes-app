import React from "react";
import "../style/confirmDialog.css";
import { GiCheckMark } from "react-icons/gi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Confirmation({ message, onConfirm, onCancel }) {
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-dialog">
        <p>{message}</p>
        <GiCheckMark
          className="icon"
          onClick={onConfirm}
          color="green"
        />
        <FontAwesomeIcon
          icon={faXmark}
          className="icon"
          onClick={onCancel}
          color="red"
        />
      </div>
    </div>
  );
}

export default Confirmation;
