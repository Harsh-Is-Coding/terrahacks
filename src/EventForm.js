// EventForm.js
import React, { useState } from 'react';
import { db } from './FirebaseConfig'; // Ensure Firestore is initialized and configured
import { collection, addDoc } from 'firebase/firestore';
import ImageUpload from './ImageUpload';

const EventForm = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [geo, setgeo] = useState(null);

  // Function to generate a random eventID
  

  // Function to geocode the location address using Nominatim
  const geocodeLocation = async () => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        setgeo({ lat, lng: lon });
        console.log('Coordinates:', { lat, lon });
      } else {
        console.error('No results found for the location.');
      }
    } catch (error) {
      console.error('Error fetching geocode:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageURL) {
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
      const eventAuthor = "Anonymous"; // Replace with actual user data if needed

      const eventData = {
        title,
        desc,
        date: new Date(date),
        location,
        image: imageURL,
        geo, // Include geo data in the event
        eventAuthor,
      };

      console.log('Event data to be submitted:', eventData);

      // Save the event data to Firestore
      await addDoc(collection(db, 'events'), eventData);

      console.log('Event created successfully in Firestore');

      // Clear form fields
      setTitle('');
      setDesc('');
      setDate('');
      setLocation('');
      setImageURL('');
      setgeo(null);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
    }
  };

  return (
    <div style={{zIndex: 2}}>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={geocodeLocation}>Get Coordinates</button>
        {geo && (
          <p>
            Latitude: {geo.lat}, Longitude: {geo.lng}
          </p>
        )}
        <ImageUpload onUploadComplete={setImageURL} />
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
