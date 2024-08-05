// EventForm.js
import React, { useState, useEffect } from 'react';
import { db, storage } from './FirebaseConfig'; // Ensure Firestore and Storage are initialized and configured
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ImageUpload from './ImageUpload';
import './EventFormStyles.css'; // Import the CSS file

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [geo, setGeo] = useState(null);
  const [isOrganizer, setIsOrganizer] = useState(false);

  useEffect(() => {
    const checkIsOrganizer = () => {
      const organizerStatus = localStorage.getItem('isOrganizer') === 'true';
      setIsOrganizer(organizerStatus);
    };

    checkIsOrganizer();
  }, []);

  const geocodeLocation = async () => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setGeo({ lat, lng: lon });
        console.log('Coordinates:', { lat, lon });
      } else {
        console.error('No results found for the location.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      console.error('No image file selected');
      return null;
    }

    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading image:', error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      console.error('No image uploaded');
      alert('Please upload an image before creating the event.');
      return;
    }

    if (!geo) {
      console.error('No coordinates found for the location');
      alert('Please ensure the location is correct and try again.');
      return;
    }

    try {
      const imageURL = await handleImageUpload();
      if (!imageURL) {
        console.error('Error getting image URL');
        alert('Error uploading image. Please try again.');
        return;
      }

      const eventAuthor = "Anonymous"; // Replace with actual user data if needed

      const eventData = {
        title,
        desc,
        date: new Date(date),
        location,
        image: imageURL,
        geo,
        eventAuthor,
      };

      console.log('Event data to be submitted:', eventData);

      await addDoc(collection(db, 'events'), eventData);

      console.log('Event created successfully in Firestore');

      setTitle('');
      setDesc('');
      setDate('');
      setLocation('');
      setImageFile(null);
      setGeo(null);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
    }
  };

  return (
    <div className="event-form-container">
      {isOrganizer ? (
        <div>
          <h2 className="event-form-title">Create Event</h2>
          <form className="event-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <input
              type="datetime-local"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            {geo && (
              <div className="geo-info">
                <p>Latitude: {geo.lat}, Longitude: {geo.lng}</p>
              </div>
            )}
            <ImageUpload onUploadComplete={(file) => {
              setImageFile(file);
              // Automatically call geocodeLocation if needed
              geocodeLocation();
            }} />
            <button type="submit">Create Event</button>
          </form>
        </div>
      ) : (
        <h2>Only organizers can create events</h2>
      )}
    </div>
  );
};

export default EventForm;
