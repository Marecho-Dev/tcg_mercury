import React from "react";
interface CameraUploadButtonProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const CameraUploadButton: React.FC<CameraUploadButtonProps> = ({
  onFileChange,
}) => {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        capture="environment"
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
