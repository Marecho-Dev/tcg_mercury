import React from "react";

const CameraUploadButton = ({ onFileChange }) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="camera"
        onChange={onFileChange}
        style={{ display: "none" }}
        id="cameraInput"
      />
      <label htmlFor="cameraInput" className="upload-button">
        Upload from Camera
      </label>
    </div>
  );
};

export default CameraUploadButton;
