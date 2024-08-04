import React, { useRef } from 'react';

const ImageUpload = ({ onUploadComplete }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadComplete(file);
    } else {
      console.error('No file selected');
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button type="button" onClick={() => fileInputRef.current.click()}>Upload Image</button>
    </div>
  );
};

export default ImageUpload;