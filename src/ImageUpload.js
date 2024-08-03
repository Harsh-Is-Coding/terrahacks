// ImageUpload.js
import React, { useState } from 'react';
import { storage } from './FirebaseConfig'; // Ensure Firestore is initialized and configured';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
const ImageUpload = ({ onUploadComplete }) => {
  const [preview, setPreview] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result);
        // Simulate image upload to server and get the URL
        // Replace this with actual upload logic
        const fakeUploadURL = URL.createObjectURL(file); // Example, replace with actual upload
        onUploadComplete(fakeUploadURL);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="image-upload"
      />
      <label htmlFor="image-upload" className="image-upload-label">
        <div className="upload-placeholder">Upload Image</div>
      </label>
      {preview && <img src={preview} alt="Image Preview" className="image-preview" />}
    </div>
  );
};

export default ImageUpload;